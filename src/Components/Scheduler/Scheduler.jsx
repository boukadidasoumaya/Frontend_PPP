import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Inject, Resize, DragAndDrop, } from '@syncfusion/ej2-react-schedule';
import './Scheduler.css';
import axios from 'axios';
import { Row, Col, Alert , Modal,ModalHeader,ModalBody,Spinner,Button} from 'reactstrap';
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
    // Fix `now` to the start of the week (Sunday)
    const now = new Date();
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const resultDate = new Date(firstDayOfWeek);

    // Calculate the specific date for the given dayOfWeek
    resultDate.setDate(firstDayOfWeek.getDate() + dayOfWeek);

    // Set the time
    const [hours, minutes] = time.split(':').map(Number);
    resultDate.setHours(hours, minutes, 0, 0);

    return resultDate;
};


const getDayOfWeek = (dayString) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek.indexOf(dayString);
};

const EditorTemplate = () => {
    const startHour = "08:00";
    const endHour = "18:00";
    const [dataSource, setDataSource] = useState([]);
    const [majors, setMajors] = useState([]);
    const [levels, setLevels] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const scheduleObj = useRef(null);
    const [currentView, setCurrentView] = useState('Week');
    const [isTimelineView, setIsTimelineView] = useState(false);
    const [dataSourceSemester1, setDataSourceSemester1] = useState([]);
    const [dataSourceSemester2, setDataSourceSemester2] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const transformedDataSemester1 = [];
    const transformedDataSemester2 = [];
    
    useEffect(() => {
        axios.get("http://localhost:5000/classes/majors")
            .then(response => {
                setMajors(response.data.majors);
            })
            .catch(error => {
                console.error("Error fetching majors:", error);
            });

        axios.get("http://localhost:5000/classes/levels")
            .then(response => {
                setLevels(response.data.levels);
            })
            .catch(error => {
                console.error("Error fetching levels:", error);
            });
    }, []);

    useEffect(() => {
        if (selectedMajor || selectedLevel) {
            fetchTimeTables(selectedMajor, selectedLevel);
            
        }
    }, [selectedMajor, selectedLevel,transformedDataSemester1,transformedDataSemester2]);

    const fetchTimeTables = (major, level) => {
        axios.get(`http://localhost:5000/timetables/majoryear/${major}/${level}`)
            .then(response => {
               
                response.data.data.forEach(item => {
                    const transformedItem = {
                        Id: item._id,
                        Subject: item.SubjectName,
                        Location: item.teacher_name,
                        Description: `Classroom: ${item.Room}, Groupe: ${item.group}`,
                        StartTime: getNextDate(getDayOfWeek(item.Day), item.StartTime),
                        EndTime: getNextDate(getDayOfWeek(item.Day), item.EndTime),
                        GroupId: item.group
                    };
                    if (item.Semester === 1) {
                        transformedDataSemester1.push(transformedItem);
                    } else if (item.Semester === 2) {
                        transformedDataSemester2.push(transformedItem);
                    }
                });
                setDataSourceSemester1(transformedDataSemester1);
                setDataSourceSemester2(transformedDataSemester2);
            })
            .catch(error => {
                console.error("Error fetching time tables:", error);
            });
    };
    

    const handleMajorChange = (event) => {
        setSelectedMajor(event.target.value);
    };

    const handleLevelChange = (event) => {
        setSelectedLevel(event.target.value);
    };

    const onPrint = () => {
        scheduleObj.current.print();
    };

    const importTemplateFn = (data) => {
        const template = '<div class="e-template-btn"><span class="e-btn-icon e-icons e-upload-1 e-icon-left"></span>${text}</div>';
        return compile(template.trim())(data);
    };

   
 //upload 
    const [Alertvisible, setAlertVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [UploadErrors, setUploadErrors] = useState([]);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadsuccess, setUploadSuccess] = useState(false);
    const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    const createUpload = () => {
        const file = document.querySelector('.calendar-import .e-css.e-btn');
        file.classList.add('e-inherit');

    };
    const onImportClick = (args) => {
        const file = args.event.target.files[0];
        
        console.log('file', file);
    
        if (file && file.type === 'text/csv') {
            const formdata = new FormData();
            formdata.append('csv', file);
            setIsLoading(true); 
            axios.post("http://localhost:5000/timetables/upload", formdata, config)
                .then(response => {
                    console.log('File uploaded');
                    setUploadSuccess(true);
                    console.log(uploadsuccess);
                    setIsLoading(false);
                })
                .catch(error => {
                    setUploadErrors(error.response.data.error);
                    setUploadModalOpen(!uploadModalOpen);
                    console.error('Error in uploading file:', error.response.data.error);
                    setSelectedFile(null);
                    setIsLoading(false);
                });
        } else {
            console.log('Please enter a CSV file');
            setAlertVisible(true);
            setSelectedFile(null);
        }
    };
    
    const onDismiss = () => {
        setAlertVisible(!Alertvisible)};
    const onDismisssuccess = () => {
        setUploadSuccess(!uploadsuccess)};

    const toggleUploadModal = () => setUploadModalOpen(!uploadModalOpen);
    const onToolbarItemClicked = (args) => {
        switch (args.item.text) {
            case 'Day':
                setCurrentView(isTimelineView ? 'TimelineDay' : 'Day');
                break;
            case 'Week':
                setCurrentView(isTimelineView ? 'TimelineWeek' : 'Week');
                break;
            default:
                break;
        }
    };
    //drop timetable
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [semesterToDelete, setSemesterToDelete] = useState('');
    const [deleteNotification, setDeleteNotification] = useState(false);
    const handleDelete = () => {
        if (semesterToDelete === 'Semester 1') {

        axios.delete(`http://localhost:5000/timetables/drop/${selectedMajor}/${selectedLevel}/1`)
                .then(response => {
                    console.log('TimeTable Dropped for sem 1');
                    setDeleteNotification(true);
                })
                .catch(error => {
                    console.error('Error in dropping Timetable:', error.response.data.error);
                    
                });
        } else if (semesterToDelete === 'Semester 2') {
            axios.delete(`http://localhost:5000/timetables/drop/${selectedMajor}/${selectedLevel}/2`)
                .then(response => {
                    console.log('TimeTable Dropped for sem 2');
                    setDeleteNotification(true);
                })
                .catch(error => {
                    console.error('Error in dropping Timetable:', error.response.data.error);
                    
                });
        }
        toggleDeleteModal();
    };

    const toggleDeleteModal = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen);
    };

    const onDeleteClick = (semester) => {
        setSemesterToDelete(semester);
        toggleDeleteModal();
    };

    return (
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
                        <Row className=''>
                        {uploadsuccess && (
          <div className='col d-flex justify-content-end'>
              <Alert isOpen={uploadsuccess} toggle={onDismisssuccess} color='success'>
               File Uploaded
              </Alert>
          </div>
        ) }
        {Alertvisible && (
          <div className='col alertMessage d-flex justify-content-end'>
              <Alert isOpen={Alertvisible} toggle={onDismiss} className="alert-slide">
                Please Enter a CSV File 
              </Alert>
          </div>
        ) }
            {isLoading && (<Row className='loadingButton'>

                <Button
                  color="primary"
                  className='loadingButton'
                  disabled
                >
                  <Spinner size="sm">
                    Loading...
                  </Spinner>
                  <span>
                    {' '}Loading
                  </span>
                </Button>
                </Row>)}
        </Row>
        
        <Modal isOpen={uploadModalOpen} toggle={toggleUploadModal}>
                <ModalHeader color="danger" toggle={toggleUploadModal}>Error in Uploading File </ModalHeader>
                <ModalBody>
                  {UploadErrors ? (
                    <div>
                      <p>Error in  inserting timetable into the database.</p>
                    
                    </div>
                  ) : null}
                </ModalBody>
    
        </Modal>

                        <AppBarComponent colorMode=''>
                            <div className="e-appbar-spacer"></div>
                            <div className='control-panel calendar-export'>
                                <ButtonComponent id='printBtn' cssClass='title-bar-btn e-inherit' iconCss='e-icons e-print' onClick={onPrint} content='Print' />
                            </div>
                            <div className='control-panel import-button'>
                            <UploaderComponent 
                                    id='fileUpload' 
                                    type='file' 
                                    allowedExtensions='*' // Autoriser tous les types de fichiers
                                    cssClass='calendar-import' 
                                    buttons={{ browse: importTemplateFn({ text: 'Import' })[0] }} 
                                    multiple={false} 
                                    showFileList={false} 
                                    selected={onImportClick} 
                                    created={createUpload} 
                                />

                            </div>
                        
                        </AppBarComponent>
                        <ToolbarComponent id='toolbarOptions' cssClass='overview-toolbar' className='toolbar' width='100%' height={70} overflowMode='Scrollable' scrollStep={100} clicked={onToolbarItemClicked}>
                            <ItemsDirective>
                            
                                <ItemDirective type='Separator' />
                                <ItemDirective prefixIcon='e-icons e-day' tooltipText='Day' text='Day' tabIndex={0} />
                                <ItemDirective prefixIcon='e-icons e-week' tooltipText='Week' text='Week' tabIndex={0} />
                                <ItemDirective type='Separator' />
                            </ItemsDirective>
                        </ToolbarComponent>
                        <div className='overview-content'>
                            <div className='left-panel'>
                                <div className='overview-scheduler'>
                                    
                                   <div className='row'>
                                  <div className='col-6'>
                                     <h2>Semestre 1</h2>
                                  </div>
                                   {selectedMajor && selectedLevel && <div className='col-6 d-flex justify-content-end'>
                        
                                        <button  onClick={() => onDeleteClick('Semester 1')} class="delete-button">
                                            <svg class="delete-svgIcon" viewBox="0 0 448 512">
                                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                                          </svg>
                                        </button>
                                    </div>}
                                   </div>
                                    <ScheduleComponent
                                        currentView={'Week'}
                                        width="100%"
                                        height="650px"
                                        eventSettings={{
                                            dataSource: dataSourceSemester1,
                                            allowAdding: false,
                                            allowDeleting: false, 
                                            allowEditing: false,
                                            
                                        }}
                                        startHour={startHour}
                                        endHour={endHour}
                                        workDays={[1, 2, 3, 4, 5, 6]}
                                        readOnly={true}
                                    >
                                        <ViewsDirective>
                                            <ViewDirective option="Day" />
                                            <ViewDirective option="Week" />
                                        </ViewsDirective>
                                        <Inject services={[Day, Week]} />
                                    </ScheduleComponent>
                                </div>
                            </div>
                            </div>
                            <div className='overview-content'>
                            <div className='left-panel'>
                                <div className='overview-scheduler'>
                                <div className='row'>
                                  <div className='col-6'>
                                     <h2>Semestre 2</h2>
                                  </div>
                                    <div className='col-6 d-flex justify-content-end'>
                                    {selectedMajor && selectedLevel && <button  onClick={() => onDeleteClick('Semester 2')} class="delete-button">
                                            <svg class="delete-svgIcon" viewBox="0 0 448 512">
                                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                                          </svg>
                                        </button>}
                                    </div>
                                   </div>  <ScheduleComponent
                                        currentView={'Week'}
                                        width="100%"
                                        height="650px"
                                        eventSettings={{ dataSource: dataSourceSemester2 , 
                                        allowAdding: false, 
                                        allowDeleting: false, 
                                        allowEditing: false, 
                                    }}
                                        startHour={startHour}
                                        endHour={endHour}
                                        readOnly={true}
                                    >
                                        <ViewsDirective>
                                            <ViewDirective option="Day" />
                                            <ViewDirective option="Week" />
                                        </ViewsDirective>
                                        <Inject services={[Day, Week]} />
                                    </ScheduleComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
              {/* Delete Confirmation Modal */}
              <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
                <ModalHeader toggle={toggleDeleteModal}>Confirm Deletion</ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete the timetable for {semesterToDelete}?</p>
                    <Button color="danger" onClick={handleDelete}>Delete</Button>
                    <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default EditorTemplate;
