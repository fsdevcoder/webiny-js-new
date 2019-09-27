import React from "react";
import Auth from "@aws-amplify/auth";
import { withApollo } from "react-apollo";
import localStorage from "store";
import observe from "store/plugins/observe";
import debug from "./debug";
localStorage.addPlugin(observe);

class Authenticator extends React.Component {
    constructor() {
        super();

        this.state = {
            authState: "signIn",
            authData: null
        };
    }

    async componentDidMount() {
        const query = new URLSearchParams(window.location.search);
        const queryData = {};
        query.forEach((value, key) => (queryData[key] = value));
        const { state, ...params } = queryData;

        if (state) {
            await this.onChangeState(state, params);
            return;
        }
        return this.checkUser();
    }

    checkUser = async () => {
        this.setState({ checkingUser: true });
        try {
            const cognitoUser = await Auth.currentSession();
            if (!cognitoUser) {
                await this.onChangeState("signIn");
                this.setState({ checkingUser: false });
            }
        } catch (e) {
            debug("Error %s", e);
            this.setState({ checkingUser: false });
        }
    };

    onChangeState = async (state, data, message = null) => {
        this.setState({ message });

        debug("Requested state change %s %O", state, data);
        if (state === this.state.authState) {
            return;
        }

        // Cognito states call this state with user data.
        if (state === "signedIn" && data) {
            const user = await Auth.currentSession();
            return this.props.onIdToken(user.idToken.jwtToken);
        }

        if (state === "signedOut") {
            state = "signIn";
        }

        this.setState({ authState: state, authData: data, error: null });
    };

    render() {
        const { user, authState, authData, checkingUser, message } = this.state;

        return this.props.children({
            user,
            authState,
            authData,
            changeState: this.onChangeState,
            checkingUser,
            message
        });
    }
}

export default withApollo(Authenticator);
