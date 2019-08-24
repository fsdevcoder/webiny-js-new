import React from "react";
import _ from "lodash";
import { inject } from "webiny-app";

/**
 * TODO: Downloader
 * This component needs to be reviewed in context of GraphQL and how we plan on performing downloads (ex: PDF)
 */
@inject()
class Downloader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.downloaded = true;

        this.download = this.download.bind(this);
    }

    componentDidUpdate() {
        this.downloader && this.downloader.submit();
    }

    componentDidMount() {
        if (this.props.onReady) {
            this.props.onReady({
                download: this.download
            });
        }
    }

    download(httpMethod, url, params = null) {
        this.downloaded = false;
        this.setState({ httpMethod, url, params: _.pickBy(params, f => !_.isUndefined(f)) });
    }

    render() {
        if (this.props.render) {
            return this.props.render.call(this);
        }

        if (this.downloaded) {
            return null;
        }

        let params = null;
        if (this.state.params) {
            params = [];
            _.each(this.state.params, (value, name) => {
                if (_.isArray(value)) {
                    value.map((v, index) => {
                        params.push(
                            <input
                                type="hidden"
                                name={name + "[]"}
                                value={v}
                                key={name + "-" + index}
                            />
                        );
                    });
                    return;
                }
                params.push(<input type="hidden" name={name} value={value} key={name} />);
            });
        }

        let authorization = null;
        if (this.state.httpMethod !== "GET") {
            // TODO: after security
            /*authorization = (
                <input type="hidden" name="Authorization" value={Webiny.Cookies.get(this.props.tokenCookie)}/>
            );*/
        }

        this.downloaded = true;

        return (
            <form
                ref={ref => (this.downloader = ref)}
                method={this.state.httpMethod}
                target="_blank"
            >
                {params}
                {authorization}
            </form>
        );
    }
}

Downloader.defaultProps = {
    tokenCookie: "webiny-token",
    onReady: _.noop
};

export default Downloader;
