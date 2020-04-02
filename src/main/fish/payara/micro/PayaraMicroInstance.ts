'use strict';

/*
 * Copyright (c) 2020 Payara Foundation and/or its affiliates and others.
 * All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0, which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the
 * Eclipse Public License v. 2.0 are satisfied: GNU General Public License,
 * version 2 with the GNU Classpath Exception, which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 */

import { ChildProcess } from "child_process";
import * as path from "path";
import * as vscode from "vscode";
import { Uri } from "vscode";
import { JDKVersion } from "../server/start/JDKVersion";

export class PayaraMicroInstance extends vscode.TreeItem implements vscode.QuickPickItem {

    public label: string;

    public description: string | undefined;

    private outputChannel: vscode.OutputChannel;

    private state: InstanceState = InstanceState.STOPPED;

    private jdkHome: string | null = null;

    private homePage: string | undefined;

    private process: ChildProcess | undefined;

    private buildPluginExist: boolean = false;

    private debug: boolean = false;

    constructor(private context: vscode.ExtensionContext, private name: string, private path: Uri) {
        super(name);
        this.label = name;
        this.outputChannel = vscode.window.createOutputChannel(name);
        this.setState(InstanceState.STOPPED);
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getPath(): Uri {
        return this.path;
    }

    public getJDKHome(): string | undefined {
        if (this.jdkHome === null) {
            return JDKVersion.getDefaultJDKHome();
        }
        return this.jdkHome;
    }

    public setJDKHome(jdkHome: string) {
        this.jdkHome = jdkHome;
    }

    public setDebug(debug: boolean): void {
        this.debug = debug;
    }

    public isDebug(): boolean {
        return this.debug;
    }

    public isLoading(): boolean {
        return this.state === InstanceState.LODING;
    }

    public isStarted(): boolean {
        return this.state === InstanceState.RUNNING;
    }

    public isStopped(): boolean {
        return this.state === InstanceState.STOPPED;
    }

    public async setState(state: InstanceState): Promise<void> {
        this.state = state;
        this.iconPath = this.context.asAbsolutePath(path.join('resources', this.getIcon()));
        this.contextValue = this.getState();
        this.tooltip = this.getPath().fsPath;
        vscode.commands.executeCommand('payara.micro.refresh', this);
    }

    public getState(): InstanceState {
        return this.state;
    }

    public getIcon(): string {
        let icon: string = `payara.svg`;
        if (this.isLoading()) {
            icon = `payara-loading.svg`;
        } else if (this.isStarted()) {
            if (this.isDebug()) {
                icon = `payara-started-debug.svg`;
            } else {
                icon = `payara-started.svg`;
            }
        }
        return icon;
    }

    public getHomePage() {
        return this.homePage;
    }

    public setHomePage(homePage: string) {
        this.homePage = homePage;
    }

    public isBuildPluginExist() {
        return this.buildPluginExist;
    }

    public setBuildPluginExist(buildPluginExist: boolean) {
        this.buildPluginExist = buildPluginExist;
    }

    public getProcess() {
        return this.process;
    }

    public setProcess(process: ChildProcess) {
        this.process = process;
    }

    public getOutputChannel(): vscode.OutputChannel {
        return this.outputChannel;
    }

    public dispose() {
        this.outputChannel.dispose();
    }

}

export enum InstanceState {
    RUNNING = "runningPayaraMicro",
    LODING = "loadingPayaraMicro",
    STOPPED = "stoppedPayaraMicro"
}