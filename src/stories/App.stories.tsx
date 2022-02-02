import {ReduxStoreProviderDecorator} from './decorators/ReduxStoreProviderDecorator';
import App from '../App';

export default {
    title: 'App Stories',
    component: App,
    decorators: [ReduxStoreProviderDecorator]
}

export const AppBaseExample = (props: any) => {
    return (<App demo={true} />)
}