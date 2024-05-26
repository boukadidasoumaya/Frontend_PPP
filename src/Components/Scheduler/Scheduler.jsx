import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Inject, Resize, DragAndDrop, } from '@syncfusion/ej2-react-schedule';
import './Scheduler.css';
import axios from 'axios';
import { extend } from '@syncfusion/ej2-base';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import {  useState, useCallback } from 'react';
import { ButtonComponent, CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { ToolbarComponent, ItemsDirective, ItemDirective, ContextMenuComponent, AppBarComponent } from '@syncfusion/ej2-react-navigations';
import { ResourcesDirective, ResourceDirective,  Print, ExcelExport, ICalendarImport, ICalendarExport } from '@syncfusion/ej2-react-schedule';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
import { closest, Internationalization, isNullOrUndefined, removeClass, remove, compile } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import './Scheduler.css';
import { registerLicense } from '@syncfusion/ej2-base';
import { format } from 'date-fns';
import SelectOptions from '../SelectOptions/SelectOptions';

registerLicense('ORg4AjUWIQA/Gnt2UFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX5Xd0BjXHpcc3NRQ2hY');

const getNextDate = (dayOfWeek, time) => {
    const now = new Date();
    const resultDate = new Date();
    resultDate.setDate(now.getDate() + ((7 + dayOfWeek - now.getDay()) % 7));
    resultDate.setHours(time.split(':')[0], time.split(':')[1], 0, 0);
    if (resultDate < now) {
        resultDate.setDate(resultDate.getDate() + 7);
    }
    return resultDate;
};


const EditorTemplate = () => {
    const startHour = "08:00";
    const endHour = "18:00";
    const workDays = [1, 2, 3, 4, 5, 6]; 
    const [dataSource, setDataSource] = useState([]);
    const fetchTimeTables = (selectedMajor) => {
        axios
            .get(`http://localhost:5000/timetables/majoryear/${selectedMajor}/${selectedLevel}/1`)
            .then((response) => {
                // Transform data from API to match ScheduleComponent's data structure
                const transformedData = response.data.data.map(item => ({
                    Id: item._id,
                    Subject: item.SubjectName,
                    Location: item.teacher_name,
                    Description:item.Room,
                    StartTime: getNextDate(getDayOfWeek(item.Day), item.StartTime),
                    EndTime: getNextDate(getDayOfWeek(item.Day), item.EndTime)
                }));
                setDataSource(transformedData);
            })
            .catch((error) => {
                console.error("Error fetching time tables:", error);
            });
    };

    // Function to get the day of the week based on the day string (e.g., 'Monday', 'Tuesday', etc.)
    const getDayOfWeek = (dayString) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return daysOfWeek.indexOf(dayString);
    };
const [majors, setMajors] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/classes/majors")
      .then((response) => {
        setMajors(response.data.majors);
        console.log("Majors fetched:", response.data.majors);
        console.log("Majors:", majors);
      })
      .catch((error) => {
        console.error("Error fetching majors:", error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:5000/classes/levels")
      .then((response) => {
        setLevels(response.data.levels);
      })
      .catch((error) => {
        console.error("Error fetching levels:", error);
      });
  }, []);
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const handleMajorChange = (event) => {
        const selectedMajor = event.target.value;
        setSelectedMajor(selectedMajor); 
        fetchTimeTables(selectedMajor);
    };
    const handleLevelChange = (event) => {
        const selectedLevel = event.target.value;
        setSelectedLevel(selectedLevel);
        fetchTimeTables(selectedLevel);
    };
    
    
    let scheduleObj = useRef(null);
    const [currentView, setCurrentView] = useState('Week');
    const [isTimelineView, setIsTimelineView] = useState(false);
    const data = extend([], dataSource, null, true);
    console.log(data);
    
    const onPrint = () => {
        scheduleObj.current.print();
    };
    const importTemplateFn = (data) => {
        const template = '<div class="e-template-btn"><span class="e-btn-icon e-icons e-upload-1 e-icon-left"></span>${text}</div>';
        return compile(template.trim())(data);
    };
    const onImportClick = (args) => {
        scheduleObj.current.importICalendar(args.event.target.files[0]);
    };
    
        
    const createUpload = () => {
        const element = document.querySelector('.calendar-import .e-css.e-btn');
        element.classList.add('e-inherit');
    };
    const getEventData = () => {
        const date = scheduleObj.current.selectedDate;
        return {
            Id: scheduleObj.current.getEventMaxID(),
            Subject: '',
            StartTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours(), 0, 0),
            EndTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours() + 1, 0, 0),
            Location: '',
            Professor: '',
            IsAllDay: false,
            CalendarId: 1
        };
    };
    const onToolbarItemClicked = (args) => {
        // eslint-disable-next-line default-case
        switch (args.item.text) {
            case 'Day':
                setCurrentView(isTimelineView ? 'TimelineDay' : 'Day');
                break;
            case 'Week':
                setCurrentView(isTimelineView ? 'TimelineWeek' : 'Week');
                break;
            case 'New Event':
                const eventData = getEventData();
                scheduleObj.current.openEditor(eventData, 'Add', true);
                break;
        }
    };
    
    
    const onActionBegin = (args) => {
        if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
            let data = args.data instanceof Array ? args.data[0] : args.data;
            args.cancel = !scheduleObj.current.isSlotAvailable(data.StartTime, data.EndTime);
        }
    };
    const editorHeaderTemplate = (props) => {
        return (<div id="event-header">
        {(props !== undefined) ? ((props.Subject) ? <div>{props.Subject}</div> : <div>Create New Event</div>) : <div></div>}
        </div>);
    };
    const editorTemplate = (props) => {
        return (
            (props !== undefined) ?
                <table className="custom-event-editor" style={{ width: '100%' }} cellPadding={5}>
                    <tbody>
                        <tr>
                            <td className="e-textlabel">Course</td>
                            <td colSpan={4}>
                                <DropDownListComponent id="Subject" placeholder='Choose course' data-name='Subject' className="e-field" style={{ width: '100%' }} dataSource={['Analyse', 'Programmation', 'Java']} />
                            </td>
                        </tr>
                        <tr>
                            <td className="e-textlabel">Professor</td>
                            <td colSpan={4}>
                                <DropDownListComponent id="Professor" placeholder='Choose Professor' data-name='Professor' className="e-field" style={{ width: '100%' }} dataSource={['Sofienne', 'Saloua', 'Aymen']} />
                            </td>
                        </tr>
                        <tr>
                            <td className="e-textlabel">Classroom</td>
                            <td colSpan={4}>
                                <DropDownListComponent id="Classroom" placeholder='Choose Classroom' data-name='Classroom' className="e-field" style={{ width: '100%' }} dataSource={['120', '121', '131']} />
                            </td>
                        </tr>
                        <tr>
                            <td className="e-textlabel">From</td>
                            <td colSpan={4}>
                                <DateTimePickerComponent id="StartTime" format='dd/MM/yy hh:mm a' data-name="StartTime" value={new Date(props.startTime || props.StartTime)} className="e-field" />
                            </td>
                        </tr>
                        <tr>
                            <td className="e-textlabel">To</td>
                            <td colSpan={4}>
                                <DateTimePickerComponent id="EndTime" format='dd/MM/yy hh:mm a' data-name="EndTime" value={new Date(props.endTime || props.EndTime)} className="e-field" />
                            </td>
                        </tr>
                    
                
                    </tbody>
                </table>
                :
                <div></div>
        );
    };
    return (
    <>
    <div className='schedule-control-section'>
        <div className='col-lg-12 control-section'>
            <div className='content-wrapper'>
            <div className='schedule-overview'>
            <div className="select-container">
                                        <select value={selectedMajor} onChange={handleMajorChange} placeholder="Major">
                                            <option value="" disabled>Major</option>
                                            {majors.map((major, index) => (
                                                <option key={index} value={major}>{major}</option>
                                            ))}
                                        </select>
                                        <select value={selectedLevel} onChange={handleLevelChange} placeholder="Year">
                                            <option value="" disabled>Year</option>
                                            {levels.map((year, index) => (
                                                <option key={index} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
            <AppBarComponent colorMode=''>
                
                <div className="e-appbar-spacer">
        
                </div>
                <div className='control-panel calendar-export'>
                    <ButtonComponent id='printBtn' cssClass='title-bar-btn e-inherit' iconCss='e-icons e-print' onClick={(onPrint)} content='Print'/>
                </div>
                <div className='control-panel import-button'>
                    <UploaderComponent id='fileUpload' type='file' allowedExtensions='.ics' cssClass='calendar-import' buttons={{ browse: importTemplateFn({ text: 'Import' })[0] }} multiple={false} showFileList={false} selected={(onImportClick)} created={createUpload}/>
                </div>

            </AppBarComponent>
                <div>
                    <ToolbarComponent id='toolbarOptions' cssClass='overview-toolbar' className='toolbar' width='100%' height={70} overflowMode='Scrollable' scrollStep={100}  clicked={onToolbarItemClicked}>
                        <ItemsDirective>
                        <ItemDirective prefixIcon='e-icons e-plus' tooltipText='New Event' text='New Event' tabIndex={0}/>
                        <ItemDirective type='Separator'/>
                        <ItemDirective prefixIcon='e-icons e-day' tooltipText='Day' text='Day' tabIndex={0}/>
                        <ItemDirective prefixIcon='e-icons e-week' tooltipText='Week' text='Week' tabIndex={0}/>
                        <ItemDirective type='Separator'/>
                        </ItemsDirective>

                    </ToolbarComponent>
                <div className='overview-content'>
                <div className='left-panel'>
                    <div className='overview-scheduler'>
                    <ScheduleComponent
                        currentView={currentView}
                        width="100%"
                        height="650px"
                        ref={scheduleObj}
                        eventSettings={{ dataSource: data }}
                        editorTemplate={editorTemplate}
                        editorHeaderTemplate={editorHeaderTemplate}
                        actionBegin={onActionBegin}
                        enableAdaptiveUI={true}
                        startHour={startHour}
                        endHour={endHour}
                        >
                        <ViewsDirective>
                            <ViewDirective option="Day" />
                            <ViewDirective option="Week" />
                        </ViewsDirective>
                        <Inject
                            services={[
                            Day,
                            Week,
                            Print,
                            ExcelExport,
                            ICalendarImport,
                            ICalendarExport,
                            ]}
                        />
                        </ScheduleComponent>
                    </div>
                </div>
                
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>);
};
export default EditorTemplate;