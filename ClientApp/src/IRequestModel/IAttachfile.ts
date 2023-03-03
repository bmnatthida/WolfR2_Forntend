import { IUserModel } from "./IUserModel"

export type IAttachFile = {
    SecretId:string |null
    actor:IUserModel
    attach_date:string
    attach_file:string
    attach_id:number
    attach_path:string
    connectionString:string |null
    delegate_id:string|number|null
    description:string
    is_merge_pdf:boolean
    memo_id:number
    modified_by:string |null
    modified_date:string |null
    sequence:number|null
    userPrincipalName:string |null
}