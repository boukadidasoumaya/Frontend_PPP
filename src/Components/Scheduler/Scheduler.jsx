import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Inject, Resize, DragAndDrop, } from '@syncfusion/ej2-react-schedule';
import './Scheduler.css';
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
/**
 * Schedule editor template sample
 */
const EditorTemplate = () => {
    const dataSource = {
        doctorsEventData: [
            {   id:1, Subject: 'Analyse',Professor:'Saloua',  StartTime: new Date(2021, 1, 15, 10, 0),  EndTime: new Date(2021, 1, 15, 12, 30),  CalendarId: 1,   },
            {   id:2 ,  Subject: 'Programmation',Professor:'Saloua',   StartTime: new Date(2021, 1, 15, 13, 0),  EndTime: new Date(2021, 1, 15, 15, 30), CalendarId: 2,   },
            {  id:3 ,   Subject: 'Java',Professor:'Saloua',   StartTime: new Date(2021, 1, 15, 16, 0),  EndTime: new Date(2021, 1, 15, 18, 30),  CalendarId: 3,  },
            {  id:4 , Subject: 'Analyse', Professor:'Saloua',  StartTime: new Date(2021, 1, 16, 10, 0),  EndTime: new Date(2021, 1, 16, 12, 30),  CalendarId: 1,   },
            {  id:5 ,  Subject: 'Programmation',Professor:'Saloua',   StartTime: new Date(2021, 1, 16, 13, 0),  EndTime: new Date(2021, 1, 16, 15, 30), CalendarId: 2,   }
        ]
    };

    const majors = ['MPI', 'RT', 'GL','IIA','IMI','MASTER'];
    const [selectedMajor, setSelectedMajor] = useState('');
    const projectData = [
        { text: 'PROJECT 1', id: 1, color: '#cb6bb2' },
        { text: 'PROJECT 2', id: 2, color: '#56ca85' },
        { text: 'PROJECT 3', id: 3, color: '#df5286' }
    ];
    
    const categoryData = [
        { text: 'Nancy', id: 1, groupId: 1, color: '#df5286' },
        { text: 'Steven', id: 2, groupId: 1, color: '#7fa900' },
        { text: 'Robert', id: 3, groupId: 2, color: '#ea7a57' },
        { text: 'Smith', id: 4, groupId: 2, color: '#5978ee' },
        { text: 'Michael', id: 5, groupId: 3, color: '#df5286' },
        { text: 'Root', id: 6, groupId: 3, color: '#00bdae' }
    ];
    let group = { resources: ['Projects', 'Categories'] };
    
    let scheduleObj = useRef(null);
    const [currentView, setCurrentView] = useState('Week');
    const [isTimelineView, setIsTimelineView] = useState(false);
  
    let contextMenuObj = useRef(null);
    let timeBtn = useRef(null);
    let selectedTarget;
    let intl = new Internationalization();
    const data = extend([], dataSource.doctorsEventData, null, true);
    const fields = {
        startTime: { name: 'StartTime', validation: { required: true } },
        endTime: { name: 'EndTime', validation: { required: true } },
    };
    ///
    let liveTimeInterval;
    const contextMenuItems = [
        { text: 'New Event', iconCss: 'e-icons e-plus', id: 'Add' },
        { text: 'New Recurring Event', iconCss: 'e-icons e-repeat', id: 'AddRecurrence' },
        { text: 'Today', iconCss: 'e-icons e-timeline-today', id: 'Today' },
        { text: 'Edit Event', iconCss: 'e-icons e-edit', id: 'Save' },
        { text: 'Delete Event', iconCss: 'e-icons e-trash', id: 'Delete' },
        {
            text: 'Delete Event', id: 'DeleteRecurrenceEvent', iconCss: 'e-icons e-trash',
            items: [
                { text: 'Delete Occurrence', id: 'DeleteOccurrence' },
                { text: 'Delete Series', id: 'DeleteSeries' }
            ]
        },
        {
            text: 'Edit Event', id: 'EditRecurrenceEvent', iconCss: 'e-icons e-edit',
            items: [
                { text: 'Edit Occurrence', id: 'EditOccurrence' },
                { text: 'Edit Series', id: 'EditSeries' }
            ]
        }
    ];
    const calendarCollections = [
        { CalendarText: 'My Calendar', CalendarId: 1, CalendarColor: '#c43081' },
        { CalendarText: 'Company', CalendarId: 2, CalendarColor: '#ff7f50' },
        { CalendarText: 'Birthday', CalendarId: 3, CalendarColor: '#AF27CD' },
        { CalendarText: 'Holiday', CalendarId: 4, CalendarColor: '#808000' }
    ];
    const exportItems = [
        { text: 'iCalendar', iconCss: 'e-icons e-export' },
        { text: 'Excel', iconCss: 'e-icons e-export-excel' }
    ];
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
    
        const onExportClick = (args) => {
            if (args.item.text === 'Excel') {
                let exportDatas = [];
                console.log(scheduleObj.current);
                let eventCollection = scheduleObj.current.getEvents();
                let resourceCollection = scheduleObj.current.getResourceCollections();
                let resourceData = resourceCollection[0].dataSource;
                for (let resource of resourceData) {
                    let data = eventCollection.filter((e) => e.CalendarId === resource.CalendarId);
                    exportDatas = exportDatas.concat(data);
                }
                scheduleObj.current.exportToExcel({ exportType: 'xlsx', customData: exportDatas, fields: ['Id', 'Subject','Professor', 'StartTime', 'EndTime', 'CalendarId'] });
            }
            else {
                scheduleObj.current.exportToICalendar();
            }
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
            case 'WorkWeek':
                setCurrentView(isTimelineView ? 'TimelineWorkWeek' : 'WorkWeek');
                break;
            case 'Month':
                setCurrentView(isTimelineView ? 'TimelineMonth' : 'Month');
                break;
            case 'Year':
                setCurrentView(isTimelineView ? 'TimelineYear' : 'Year');
                break;
            case 'Agenda':
                setCurrentView('Agenda');
                break;
            case 'New Event':
                const eventData = getEventData();
                scheduleObj.current.openEditor(eventData, 'Add', true);
                break;
            case 'New Recurring Event':
                const recEventData = getEventData();
                console.log(recEventData)
                scheduleObj.current.openEditor(recEventData, 'Add', true, 1);
                break;
        }
    };
    const timelineTemplate = useCallback(() => {
        return (<div className='template'>
        <div className='icon-child'>
          <CheckBoxComponent id='timeline_views' checked={isTimelineView} change={onChange}/>
        </div>
        <div className='text-child'>Timeline Views</div>
      </div>);
    }, []);
    const groupTemplate = useCallback(() => {
        return (<div className='template'>
        <div className='icon-child'>
          <CheckBoxComponent id='grouping' checked={true} change={(args) => { scheduleObj.current.group.resources = args.checked ? ['Calendars'] : []; }}/>
        </div>
        <div className='text-child'>Grouping</div>
      </div>);
    }, []);
    const gridlineTemplate = useCallback(() => {
        return (<div className='template'>
        <div className='icon-child'>
          <CheckBoxComponent id='timeSlots' checked={true} change={(args) => { scheduleObj.current.timeScale.enable = args.checked; }}/>
        </div>
        <div className='text-child'>Gridlines</div>
      </div>);
    }, []);
   
    const onChange = (args) => {
        setIsTimelineView(args.checked);
    };
    const contextMenuOpen = (args) => {
        let newEventElement = document.querySelector('.e-new-event');
        if (newEventElement) {
            remove(newEventElement);
            removeClass([document.querySelector('.e-selected-cell')], 'e-selected-cell');
        }
        scheduleObj.current.closeQuickInfoPopup();
        let targetElement = args.event.target;
        if (closest(targetElement, '.e-contextmenu')) {
            return;
        }
        selectedTarget = closest(targetElement, '.e-appointment,.e-work-cells,.e-vertical-view .e-date-header-wrap .e-all-day-cells,.e-vertical-view .e-date-header-wrap .e-header-cells');
        if (isNullOrUndefined(selectedTarget)) {
            args.cancel = true;
            return;
        }
        if (selectedTarget.classList.contains('e-appointment')) {
            let eventObj = scheduleObj.current.getEventDetails(selectedTarget);
            if (eventObj.RecurrenceRule) {
                contextMenuObj.current.showItems(['EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
                contextMenuObj.current.hideItems(['Add', 'AddRecurrence', 'Today', 'Save', 'Delete'], true);
            }
            else {
                contextMenuObj.current.showItems(['Save', 'Delete'], true);
                contextMenuObj.current.hideItems(['Add', 'AddRecurrence', 'Today', 'EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
            }
            return;
        }
        else if ((selectedTarget.classList.contains('e-work-cells') || selectedTarget.classList.contains('e-all-day-cells')) &&
            !selectedTarget.classList.contains('e-selected-cell')) {
            removeClass([].slice.call(scheduleObj.current.element.querySelectorAll('.e-selected-cell')), 'e-selected-cell');
            selectedTarget.setAttribute('aria-selected', 'true');
            selectedTarget.classList.add('e-selected-cell');
        }
        contextMenuObj.current.hideItems(['Save', 'Delete', 'EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
        contextMenuObj.current.showItems(['Add', 'AddRecurrence', 'Today'], true);
    };
    const contextMenuSelect = (args) => {
        let selectedMenuItem = args.item.id;
        let eventObj = {};
        if (selectedTarget && selectedTarget.classList.contains('e-appointment')) {
            eventObj = scheduleObj.current.getEventDetails(selectedTarget);
        }
        // eslint-disable-next-line default-case
        switch (selectedMenuItem) {
            case 'Today':
                scheduleObj.current.selectedDate = new Date();
                break;
            case 'Add':
            case 'Save':
            case 'EditOccurrence':
            case 'EditSeries':
                if (selectedMenuItem === 'EditSeries') {
                    let query = new Query().where(scheduleObj.current.eventFields.id, 'equal', eventObj.RecurrenceID);
                    eventObj = new DataManager(scheduleObj.current.eventsData).executeLocal(query)[0];
                }
                scheduleObj.current.openEditor(eventObj, selectedMenuItem);
                break;
            case 'Delete':
                scheduleObj.current.deleteEvent(eventObj);
                break;
            case 'DeleteOccurrence':
            case 'DeleteSeries':
                scheduleObj.current.deleteEvent(eventObj, selectedMenuItem);
                break;
        }
    };
    ///
    
    const onEventRendered = (args) => {
        // eslint-disable-next-line default-case
        switch (args.data.Professor) {
            case 'Requested':
                args.element.style.backgroundColor = '#F57F17';
                break;
            case 'Confirmed':
                args.element.style.backgroundColor = '#7fa900';
                break;
            case 'New':
                args.element.style.backgroundColor = '#8e24aa';
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
                      {/* Ajouter une ligne pour afficher le nom du professeur */}
                  
                  </tbody>
              </table>
              :
              <div></div>
      );
  };
  const eventTemplate = (event) => {
    // Accéder au nom du professeur à partir de l'objet d'événement (adaptez la propriété en fonction de votre structure de données)
    const professorName = event.professorName;
  
    // Formater la date de début et de fin
    const startDate = format(new Date(event.startTime), 'dd MMM yyyy');
    const endDate = format(new Date(event.endTime), 'dd MMM yyyy');
  
    // Retourner le contenu HTML avec les informations de l'événement
    return (
      <div className="custom-event">
        <div className="event-title">{event.subject}</div>
        <div className="event-professor">{professorName}</div>
        <div className="event-time">
          {startDate} - {endDate}
        </div>
      </div>
    );
  };
  
  
    return (
    <>
    <div className='schedule-control-section'>
        <div className='col-lg-12 control-section'>
            <div className='content-wrapper'>
            <div className='schedule-overview'>
            <AppBarComponent colorMode=''>
                
                <span id="timeBtn" className="time current-time" ref={timeBtn}>
        
                </span>
                <div className="e-appbar-spacer">
        
                </div>
                <div className='control-panel calendar-export'>
                    <ButtonComponent id='printBtn' cssClass='title-bar-btn e-inherit' iconCss='e-icons e-print' onClick={(onPrint)} content='Print'/>
                </div>
                <div className='control-panel import-button'>
                    <UploaderComponent id='fileUpload' type='file' allowedExtensions='.ics' cssClass='calendar-import' buttons={{ browse: importTemplateFn({ text: 'Import' })[0] }} multiple={false} showFileList={false} selected={(onImportClick)} created={createUpload}/>
                </div>
                <div className='control-panel calendar-export'>
                    <DropDownButtonComponent id='exportBtn' content='Export' cssClass='e-inherit' items={exportItems} select={onExportClick}/>
                </div>
               
              </AppBarComponent>
              <div>
              <ToolbarComponent id='toolbarOptions' cssClass='overview-toolbar' className='toolbar' width='100%' height={70} overflowMode='Scrollable' scrollStep={100} created={() => liveTimeInterval = setInterval(() => { }, 1000)} clicked={onToolbarItemClicked}>
                <ItemsDirective>
                  <ItemDirective prefixIcon='e-icons e-plus' tooltipText='New Event' text='New Event' tabIndex={0}/>
                  <ItemDirective type='Separator'/>
                  <ItemDirective prefixIcon='e-icons e-day' tooltipText='Day' text='Day' tabIndex={0}/>
                  <ItemDirective prefixIcon='e-icons e-week' tooltipText='Week' text='Week' tabIndex={0}/>
                  <ItemDirective prefixIcon='e-icons e-week' tooltipText='WorkWeek' text='WorkWeek' tabIndex={0}/>
                  <ItemDirective prefixIcon='e-icons e-month' tooltipText='Month' text='Month' tabIndex={0}/>
                  
                  <ItemDirective type='Separator'/>
                  <ItemDirective tooltipText='Grouping' text='Grouping' template={groupTemplate}/>
                  <ItemDirective tooltipText='Timme Slots' text='Timme Slots' template={gridlineTemplate}/>
                </ItemsDirective>
              </ToolbarComponent>
              <div className='overview-content'>
                <div className='left-panel'>
                  <div className='overview-scheduler'>
                  <ScheduleComponent
                        currentView={currentView}
                        width="100%"
                        height="650px"
                        selectedDate={new Date()}
                        ref={scheduleObj}
                        eventSettings={{ dataSource: data, fields: fields }}
                        editorTemplate={editorTemplate}
                        editorHeaderTemplate={editorHeaderTemplate}
                        actionBegin={onActionBegin}
                        eventRendered={onEventRendered}
                        eventTemplate={eventTemplate}
                        group={group}
                        enableAdaptiveUI={true}
                      >
                        <ResourcesDirective>
                          <ResourceDirective
                            field="CalendarId"
                            title="Calendars"
                            name="Calendars"
                            dataSource={calendarCollections}
                            query={new Query().where("CalendarId", "equal", 1)}
                            textField="CalendarText"
                            idField="CalendarId"
                            colorField="CalendarColor"
                          />
                            <ResourceDirective field='ProjectId' title='Choose Project' name='Projects' allowMultiple={false} dataSource={projectData} textField='text' idField='id' colorField='color' />
                            <ResourceDirective field='TaskId' title='Category' name='Categories' allowMultiple={true} dataSource={categoryData} textField='text' idField='id' groupIDField='groupId' colorField='color' />
                        
                        </ResourcesDirective>
                        <ViewsDirective>
                          <ViewDirective option="Day" />
                          <ViewDirective option="Week" />
                          <ViewDirective option="WorkWeek" />
                          <ViewDirective option="Month" />
                        </ViewsDirective>
                        <Inject
                          services={[
                            Day,
                            Week,
                            WorkWeek,
                            Month,
                            Resize,
                            DragAndDrop,
                            Print,
                            ExcelExport,
                            ICalendarImport,
                            ICalendarExport,
                          ]}
                        />
                      </ScheduleComponent>
                    <ContextMenuComponent id='overviewContextMenu' cssClass='schedule-context-menu' ref={contextMenuObj} target='.e-schedule' items={contextMenuItems} beforeOpen={contextMenuOpen} select={contextMenuSelect}/>
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