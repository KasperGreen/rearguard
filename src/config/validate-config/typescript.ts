import * as chalk from "chalk";
import * as Joi from "joi";
import { ITypescript } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue: ITypescript = {
  typescript: {
    config: {
      compileOnSave: false,
      compilerOptions: {},
    },
    configPath: "tsconfig.json",
    showConfigForIDE: true,
  },
};

const propType = {
  typescript: Joi.object().keys({
    config: Joi.object().keys({
      compileOnSave: Joi.boolean(),
      compilerOptions: Joi.object(),
    }),
    configPath: Joi.string().trim().min(0).required(),
    showConfigForIDE: Joi.boolean().required(),
  }).required(),
};

export default (fileName: string): ITypescript => {
  const { exist, value: typescript } = detectConfig(fileName, "typescript");

  if (exist) {
    const { error } = Joi.validate(typescript, propType);

    if (error !== null) {
      if (process.env.REARGUARD_ERROR_LOG === "true") {
        console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(typescript, null, 2)}"`));
        console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
      }

      return defaultValue;
    }

    return typescript;
  } else {
    return defaultValue;
  }
};
