export interface IRequestOnSubmit {
  buttonType:
    | "submit"
    | "draft"
    | "approve"
    | "cancel"
    | "recall"
    | "rework"
    | "reject"
    | "return"
    | "reply";
  inputComment: string;
  waitingFor: string | "";
  waitingForId: number | 0;
}
