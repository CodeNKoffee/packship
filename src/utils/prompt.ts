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

  const answers = await inquirer.prompt(questions);
  return answers as TemplateData;
}