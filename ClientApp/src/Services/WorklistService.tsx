import moment from "moment";
import { IUserModel } from "../IRequestModel/IUserModel";
import { IGetWorklistRequest, ITodo } from "../IRequestModel/IWorklistModel";
import { GetAllEmployee } from "./EmployeeService";

export const GetWorkListByTaskGroup = async (
  dataJson: IGetWorklistRequest
): Promise<ITodo[]> => {
  // const email = JSON.parse(window.localStorage.getItem("email") || "");
  // dataJson.UserPrincipalName = email;
  const response = await fetch("api/Worklist/GetWorkListByTaskGroup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then(async (data: ITodo[]) => {
      if (data) {
        const employees: IUserModel[] = await GetAllEmployee();
        const todoFormatDate: ITodo[] = data.sort((a, b) => {
          const aa = moment(a.ModifiedDate, "DD/MM/YYYY");
          const bb = moment(b.ModifiedDate, "DD/MM/YYYY");
          return moment(bb).diff(aa);
        });

        const todoFormatWaitingFor = todoFormatDate.map((todo) => {
          if (employees.length > 0) {
            let _todo = todo;
            let _emp: IUserModel | null = null;
            for (let i = 0; i < employees.length; i++) {
              const employee = employees[i];
              if (_todo.WaitingFor === employee.EmployeeId) {
                _emp = employee;
              }
            }
            return {
              ..._todo,
              WaitingFor: _emp,
            };
          } else {
            return {
              ...todo,
              WaitingFor: null,
              Requestor: null,
            };
          }
        });
        console.log({ todoFormatWaitingFor });

        return todoFormatWaitingFor;
      } else return [];
    })
    .catch((err) => {
      return [];
    });
  return response;
};
