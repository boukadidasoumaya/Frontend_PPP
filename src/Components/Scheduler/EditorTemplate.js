import * as React from 'react';
import { extend } from '@syncfusion/ej2-base';
import { ScheduleComponent, Day, Week, Month, Year, Resize, DragAndDrop, Inject, ResourcesDirective, ResourceDirective, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';

const EditorTemplate = () => {
    const dataSource = {
        resourceData: [
            // Vos données de ressource ici
        ],
        timelineResourceData: [
            // Vos données de ressource de la chronologie ici
        ]
    };

    const data = dataSource.timelineResourceData ? extend([], dataSource.resourceData.concat(dataSource.timelineResourceData), null, true) : dataSource.resourceData;

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

    return (
        <div className='schedule-control-section'>
            <div className='col-lg-12 control-section'>
                <div className='control-wrapper schedule-wrapper'>
                    <ScheduleComponent width='100%' height='650px' id='schedule' selectedDate={new Date(2023, 0, 4)} group={group} enableAdaptiveUI={true} currentView='Month' eventSettings={{ dataSource: data }}>
                        <ViewsDirective>
                            <ViewDirective option='Day' />
                            <ViewDirective option='Week' />
                            <ViewDirective option='Month' />
                        </ViewsDirective>
                        <ResourcesDirective>
                            <ResourceDirective field='ProjectId' title='Choose Project' name='Projects' allowMultiple={false} dataSource={projectData} textField='text' idField='id' colorField='color' />
                            <ResourceDirective field='TaskId' title='Category' name='Categories' allowMultiple={true} dataSource={categoryData} textField='text' idField='id' groupIDField='groupId' colorField='color' />
                        </ResourcesDirective>
                        <Inject services={[Day, Week, Month, Year, Resize, DragAndDrop]} />
                    </ScheduleComponent>
                </div>
            </div>
        </div>
    );
};

export default EditorTemplate;
