import * as React from 'react';

export interface PopupboxStateType {
	overlayOpacity?: number
	show?: boolean
	fadeIn?: boolean
	fadeInSpeed?: number
	fadeOut?: boolean
	fadeOutSpeed?: number
	overlayClose?: boolean
	escClose?: boolean
	titleBar?: {
		enable?: boolean
		closeButton?: boolean
		closeText?: string
		position?: string
	},
	content?: any
}

declare class Manager {
    content: any;
    config: {};
    show: boolean;
    _defaultConfig: any;
    open({ content, config }: {
        content?: any;
        config?: {};
    }): void;
    update({ content, config }: {
        content?: any;
        config?: {};
    }): void;
    close(): void;
    setDefault(defaultConfig: any): void;
    emitChange(): void;
    addChangeListener(callback: any): void;
    removeChangeListener(callback: any): void;
}

declare const PopupboxManager: Manager;


declare class PopupboxContainer extends React.Component<any, any> {
    constructor(props: any);
    _defaultState: any;
    state: any;
    context: any;
    forceUpdate(): void;
    props: any;
    refs: any;
    setState(any): void;
    handleStoreChange(params: any): void;
    closeImagebox: any;
    getConfig({ params, isInit }: {
        params: any;
        isInit: any;
    }): any;
    onKeyDown(e: any): void;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    onClosed(): void;
    cleanUp(): void;
    renderTitleBar(): any;
    render(): any;
}
