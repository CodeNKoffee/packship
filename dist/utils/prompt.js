import inquirer from 'inquirer';
export async function promptPackageDetails() {
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'Package Name:',
            validate: (input) => (input ? true : 'Package name is required.'),
        },
        {
            type: 'input',
            name: 'description',
            message: 'Package Description:',
        },
    ];
    // Use type assertion to assert answers as TemplateData
    const answers = await inquirer.prompt(questions);
    return answers;
}
