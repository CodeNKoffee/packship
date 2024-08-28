import inquirer from 'inquirer';

export interface TemplateData {
  name: string;
  description: string;
}

export async function promptPackageDetails(): Promise<TemplateData> {
  const questions: any = [
    {
      type: 'input',
      name: 'name',
      message: 'Package Name:',
      validate: (input: string) => (input ? true : 'Package name is required.'),
    },
    {
      type: 'input',
      name: 'description',
      message: 'Package Description:',
    },
  ];

  // Use type assertion to assert answers as TemplateData
  const answers = await inquirer.prompt(questions) as TemplateData;

  return answers;
}