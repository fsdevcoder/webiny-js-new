// @flow
import * as React from "react";
import { renderPlugins } from "webiny-app/plugins";

const AdminLayout = ({ children }: { children: React.Node }) => {
    return <React.Fragment>{renderPlugins("layout", { content: children })}</React.Fragment>;
};

export default AdminLayout;
