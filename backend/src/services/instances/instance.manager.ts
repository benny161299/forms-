import { StatusCodes } from "http-status-codes";
import { AppError } from "../../middlewares/error.middleware.js";
import { SchemaModel } from "../schemas/Schema.model.js";
import { InstanceModel } from "./Instance.model.js";
import type { CreateInstanceInput, IInstance, UpdateInstanceInput, AnswerValue } from "./instance.types.js";
import { QUESTION_TYPES } from "../schemas/schema.types.js";
import type { IQuestion } from "../schemas/schema.types.js";

const isAnswerMissing = (question: IQuestion, value: AnswerValue | undefined): boolean => {
  if (value === undefined || value === null) {
    return true;
  }

  switch (question.type) {
    case QUESTION_TYPES.SHORT_ANSWER:
    case QUESTION_TYPES.PARAGRAPH:
    case QUESTION_TYPES.DATE:
    case QUESTION_TYPES.TIME:
    case QUESTION_TYPES.RADIO:
    case QUESTION_TYPES.DROPDOWN:
      return typeof value !== "string" || value.trim() === "";

    case QUESTION_TYPES.CHECKBOX:
      return !Array.isArray(value) || value.length === 0;

    case QUESTION_TYPES.LINEAR_SCALE:
      return typeof value !== "number";

    case QUESTION_TYPES.RADIO_GRID: {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return true;
      }
      const record = value as Record<string, number>;
      return question.options.rows.some(
        (row) => !Object.hasOwn(record, row) || typeof record[row] !== "number",
      );
    }

    case QUESTION_TYPES.CHECKBOX_GRID: {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return true;
      }
      const record = value as Record<string, number[]>;
      return question.options.rows.some(
        (row) =>
          !Object.hasOwn(record, row) ||
          !Array.isArray(record[row]) ||
          record[row].length === 0,
      );
    }

    default:
      return false;
  }
};

const validateAnswerValue = (question: IQuestion, value: AnswerValue): string | null => {
  switch (question.type) {
    case QUESTION_TYPES.SHORT_ANSWER:
    case QUESTION_TYPES.PARAGRAPH:
    case QUESTION_TYPES.DATE:
    case QUESTION_TYPES.TIME:
      if (typeof value !== "string") {
        return `Answer for "${question.title}" must be a string`;
      }
      return null;

    case QUESTION_TYPES.RADIO:
    case QUESTION_TYPES.DROPDOWN: {
      if (typeof value !== "string") {
        return `Answer for "${question.title}" must be a string`;
      }
      if (value.trim() !== "" && !question.options.choices.includes(value)) {
        return `Answer for "${question.title}" is not a valid choice`;
      }
      return null;
    }

    case QUESTION_TYPES.CHECKBOX: {
      if (!Array.isArray(value)) {
        return `Answer for "${question.title}" must be an array`;
      }
      for (const item of value) {
        if (typeof item !== "string" || !question.options.choices.includes(item)) {
          return `Answer for "${question.title}" contains an invalid choice: "${item}"`;
        }
      }
      return null;
    }

    case QUESTION_TYPES.LINEAR_SCALE: {
      if (typeof value !== "number") {
        return `Answer for "${question.title}" must be a number`;
      }
      if (!Number.isInteger(value) || value < question.options.min || value > question.options.max) {
        return `Answer for "${question.title}" is out of range (${question.options.min}-${question.options.max})`;
      }
      return null;
    }

    case QUESTION_TYPES.RADIO_GRID: {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return `Answer for "${question.title}" must be an object`;
      }
      const record = value as Record<string, number>;
      const validRows = new Set(question.options.rows);
      for (const key of Object.keys(record)) {
        if (!validRows.has(key)) {
          return `Answer for "${question.title}" contains an unknown row: "${key}"`;
        }
        if (typeof record[key] !== "number" || !Number.isInteger(record[key]) || record[key] < 0 || record[key] >= question.options.choices.length) {
          return `Answer for "${question.title}" has an invalid column index for row "${key}"`;
        }
      }
      return null;
    }

    case QUESTION_TYPES.CHECKBOX_GRID: {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return `Answer for "${question.title}" must be an object`;
      }
      const record = value as Record<string, number[]>;
      const validRows = new Set(question.options.rows);
      for (const key of Object.keys(record)) {
        if (!validRows.has(key)) {
          return `Answer for "${question.title}" contains an unknown row: "${key}"`;
        }
        if (!Array.isArray(record[key])) {
          return `Answer for "${question.title}" has an invalid value for row "${key}"`;
        }
        for (const idx of record[key]) {
          if (typeof idx !== "number" || !Number.isInteger(idx) || idx < 0 || idx >= question.options.choices.length) {
            return `Answer for "${question.title}" has an invalid column index for row "${key}"`;
          }
        }
      }
      return null;
    }

    default:
      return null;
  }
};

export const createNewInstance = async (instanceData: CreateInstanceInput) => {
  const { schemaId } = instanceData;

  await SchemaModel.findOne({ _id: schemaId, isDraft: false })
    .lean()
    .orFail(() => new AppError("Schema not found or is still a draft", StatusCodes.NOT_FOUND));

  return InstanceModel.create({
    schemaId,
    isDraft: true,
    answers: {},
  });
};

export const fetchAllInstances = async () => {
  return InstanceModel.find({ isDraft: false }).lean();
};

export const fetchAllInstancesDrafts = async () => {
  return InstanceModel.find({ isDraft: true }).lean();
};

export const fetchInstanceById = async (id: string) => {
  return InstanceModel.findById(id)
    .lean()
    .orFail(() => new AppError("Instance not found", StatusCodes.NOT_FOUND));
};

export const updateInstanceManager = async (id: string, updateData: UpdateInstanceInput) => {
  const instance = await InstanceModel.findOne({ _id: id, isDraft: true })
    .lean()
    .orFail(() => new AppError("Instance not found, or it is not a draft", StatusCodes.NOT_FOUND));

  const schema = await SchemaModel.findOne({ _id: instance.schemaId, isDraft: false })
    .lean()
    .orFail(() => new AppError("Schema not found or is still a draft", StatusCodes.NOT_FOUND));

  const questionMap = new Map<string, IQuestion>();
  for (const section of schema.sections) {
    for (const question of section.questions) {
      questionMap.set(question.id, question);
    }
  }

  for (const [questionId, answerValue] of Object.entries(updateData.answers)) {
    const question = questionMap.get(questionId);
    if (!question) {
      throw new AppError(
        `Answer key "${questionId}" does not match any question in the schema`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const error = validateAnswerValue(question, answerValue);
    if (error) {
      throw new AppError(error, StatusCodes.BAD_REQUEST);
    }
  }

  return InstanceModel.findOneAndUpdate({ _id: id, isDraft: true }, updateData, {
    returnDocument: "after",
  })
    .lean()
    .orFail(() => new AppError("Instance not found, or it is not a draft", StatusCodes.NOT_FOUND));
};

export const submitInstanceManager = async (id: string) => {
  const instance = await InstanceModel.findOne({ _id: id, isDraft: true })
    .lean()
    .orFail(() => new AppError("Instance not found, or it is not a draft", StatusCodes.NOT_FOUND));

  const schema = await SchemaModel.findOne({ _id: instance.schemaId, isDraft: false })
    .lean()
    .orFail(() => new AppError("Schema not found or is still a draft", StatusCodes.NOT_FOUND));

  const allQuestions = schema.sections.flatMap((s) => s.questions);
  for (const question of allQuestions) {
    const answer = instance.answers[question.id];
    if (answer !== undefined) {
      const typeError = validateAnswerValue(question, answer);
      if (typeError) {
        throw new AppError(typeError, StatusCodes.BAD_REQUEST);
      }
    }

    if (question.required && isAnswerMissing(question, answer)) {
      throw new AppError(
        `Required question "${question.title}" is not answered`,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  const validQuestionIds = new Set(allQuestions.map((q) => q.id));
  for (const answerId of Object.keys(instance.answers)) {
    if (!validQuestionIds.has(answerId)) {
      throw new AppError(
        `Answer key "${answerId}" does not match any question in the schema`,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  return InstanceModel.findOneAndUpdate(
    { _id: id, isDraft: true },
    { isDraft: false },
    { returnDocument: "after" },
  )
    .lean()
    .orFail(() => new AppError("Instance not found, or it is not a draft", StatusCodes.NOT_FOUND));
};

export const removeInstance = async (id: string): Promise<IInstance> => {
  return InstanceModel.findOneAndDelete({ _id: id, isDraft: true })
    .lean()
    .orFail(() => new AppError("Instance not found, or it is not a draft", StatusCodes.NOT_FOUND));
};
