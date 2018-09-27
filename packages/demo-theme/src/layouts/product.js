import React from "react";
import styled from "react-emotion";
//import { Menu } from "components/Menu";

const Content = styled("div")({
    padding: "0 50px"
});

const Banner100 = styled("div")({
    backgroundColor: "#bb3825",
    width: "100%",
    height: 100
});

/*const Menu = () => {
    return null;
};*/

const Product = ({ children }) => {
    return (
        <div className={"product-container"}>
            {/*<Menu name={"main"}>
                {data => (
                    <ul>
                        {data.map(item => <li key={item.id}>{item.title}</li>)}
                    </ul>
                )}
            </Menu>*/}
            <Banner100/>
            <Content>{children}</Content>
            <Banner100/>
        </div>
    )
};

export default {
    name: "product",
    title: "Product",
    component: Product,
};