export type AnswerValue = 
string | 
number|
string[]|
Record  <string,number>|
Record<string,number[]>;

export interface IInstance{
    _id:string;
    schemaId:string;
    isDraft:boolean
    answers: Record<string, AnswerValue>;

}