export type QuestionType = "text" | 
"short_answer" |
"paragraph" |
"radio" |
"checkbox" | 
"dropdown" |
"linear_scale" |
 "radio_grid" |
  "checkbox_grid" | 
 "time" |
 "date";

 export interface IQuestionOptions {
choices?:string[];
min ?:number;
max?:number
rows?:string[];
}

export interface IQuestion{
    type:QuestionType;
    id:string;
    title:string;
    isRequired?: boolean;
    option?:IQuestionOptions;
    
}

export interface ISection{
    title:string;
    description :string;
    questions:IQuestion[]
}

export interface ISchema{
    _id:string;
    title:string;
    isDraft: boolean;
    sections:ISection[]
}

