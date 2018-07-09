// @flow

import React from 'react';
import { Form } from 'antd';
import type { ColProps } from 'antd';

type ComponentType = {
    input?: {},
    touched?: bool,
    children?: React$Node,
    label?: string,
    error?: string,
    hasFeedback?: bool,
    formItemLayout?: ColProps,
}

function makeField(Component: React$ComponentType<any>) {
    const FormItem = Form.Item;

    return ({
        input,
        touched,
        children,
        hasFeedback,
        label,
        error,
        formItemLayout,
        ...rest
    }: ComponentType) => {
        const hasError = touched && error;

        return (
            <FormItem
                label={ label }
                validateStatus={ hasError ? 'error' : 'success' }
                hasFeedback={ !!(hasFeedback && hasError) }
                help={ hasError }
                { ...formItemLayout }
            >
                <Component { ...input } { ...rest }>
                    { children }
                </Component>
            </FormItem>
        );
    };
}

export {
    makeField,
};
