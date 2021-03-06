import * as vscode from 'vscode';


import { TestInfo, TestSuiteInfo } from 'vscode-test-adapter-api';
import { IUnitTestArguments, IWorkspaceConfiguration } from '../src/workspaceConfiguration';

export function findTestSuiteByLabel(
    suite: TestSuiteInfo | TestInfo,
    label: string): TestSuiteInfo | TestInfo | undefined {

    if (suite.label === label) {
        return suite;
    }
    if (suite.type === 'test') {
        return undefined;
    }
    for (const child of suite.children) {
        const r = findTestSuiteByLabel(child, label);
        if (r !== undefined) {
            return r;
        }
    }
    return undefined;
}

export function findWorkspaceFolder(folder: string): vscode.WorkspaceFolder | undefined {
    return vscode.workspace.workspaceFolders!.find(f => f.name === folder);
}

export function createUnittestConfiguration(python: string, folder: string): IWorkspaceConfiguration {
    return {
        pythonPath(): string {
            return python;
        },
        parseUnitTestArguments(): IUnitTestArguments {
            return {
                startDirectory: '.',
                pattern: 'test_*.py',
            };
        },
        getCwd(): string {
            return findWorkspaceFolder(folder)!.uri.fsPath;
        },
        isUnitTestEnabled(): boolean {
            return true;
        },
    };
}
