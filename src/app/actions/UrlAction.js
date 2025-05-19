// const url = `https://smart1662.pwa.co.th`;
// const url = `http://sitdev.dyndns.org:10000`;
//Producation
// const url = 'https://smart1662.pwa.co.th';

//Test
const url = 'https://smart1662-test.pwa.co.th';

export default {
  getToken: `${url}/smapilab/token`,
  // RecevieRepair
  getIncidents: `${url}/smapilab/api/v2/Incident/GetIncidents`,
  getIncidentByIds: `${url}/smapilab/api/v2/Incident/GetIncidentByIds`,
  getBaseData: `${url}/smapilab/api/v2/Incident/GetBaseData`,
  reject: `${url}/smapilab/api/v2/Incident/Reject`,

  // Repair work
  serchRepairWork: `${url}/smapilab/api/v2/RepairWork/SearchRepairWork`,
  createRepairWork: `${url}/smapilab/api/v2/RepairWork/CreateRepairWork`,
  GetRepairWorkByID: `${url}/smapilab/api/v2/RepairWork/GetRepairWorkByID`,
  updateRepairWork: `${url}/smapilab/api/v2/RepairWork/UpdateRepairWork`,

  // jobsurvey
  updateRepairWorkSurvey: `${url}/smapilab/api/v2/RepairWork/UpdateRepairWorkSurvey`,
  updateRepairWorkProcessFile: `${url}/smapilab/api/v2/RepairWork/UpdateRepairWorkProcessFile`,
  updateRepairWorkProcess: `${url}/smapilab/api/v2/RepairWork/UpdateRepairWorkProcess`,
  updateRepairWorkCloseJob: `${url}/smapilab/api/v2/RepairWork/UpdateRepairWorkCloseJob`,
  capturePoi: `${url}/smapilab/api/v2/RepairWork/UpdateRepairWorkSurvey`,

  // Profile
  getNumOfWork: `${url}/smapilab/api/v2/RepairWork/GetNumOfWork`,

  //Filter
  getIncidentSearchCriteria: `${url}/smapilab/api/v2/Selection/GetIncidentSearchCriteria`,

  //Master
  getEmployees: `${url}/smapilab/api/v2/RepairWork/GetEmployees`,
  getSerfaces: `${url}/smapilab/api/v2/Selection/GetSerfaces`,
  getTypeOfPipes: `${url}/smapilab/api/v2/Selection/GetTypeOfPipes`,
  getSizeOfPipes: `${url}/smapilab/api/v2/Selection/GetSizeOfPipes`,
  getRequestType: `${url}/smapilab/api/v2/Selection/GetRequestType`,
  getRequestCategory: `${url}/smapilab/api/v2/Selection/GetRequestCategory`,
  getRequestCategorySubject: `${url}/smapilab/api/v2/Selection/GetRequestCategorySubject`,
  GetIncidentRejectType: `${url}/smapilab/api/v2/Selection/GetIncidentRejectType`,
  getLeakWounds: `${url}/smapilab/api/v2/Selection/GetLeakWounds`,

  //ResetPassword
  resetPassword: `${url}/smapilab/api/v2/Account/ResetPassword`
};
