import React, { useState, useEffect } from 'react';
import './Scheduler.css';
import { ScheduleComponent, Inject, Agenda, Day, Month, Week, WorkWeek, EventSettingsModel } from '@syncfusion/ej2-react-schedule';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';



const Scheduler= () => {
  const [localData] = useState({
    dataSource: [{
      EndTime: new Date(2019, 0, 11, 6, 30),
      StartTime: new Date(2019, 0, 11, 4, 0)
    }]
  });

  const remoteData = new DataManager({
    url: 'https://js.syncfusion.com/demos/ejservices/api/Schedule/LoadData',
    adaptor: new WebApiAdaptor,
    crossDomain: true
  });

  return (
    <ScheduleComponent
      currentView='Month'
      eventSettings={{ dataSource: remoteData }}
      selectedDate={new Date()}
    >
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>
  );
}

export default Scheduler;
