import React from 'react';
import AbTesting from "./newsletter-signups";
import TotalCancel from "./total-cancel";
import TotalSub from "./total-sub";
import Totals from "./totals";
import PastTests from "./pasttests";
import PageViews from "./pageviews";
import VersionDescription from "./description";
import EndTest from "./endtest";
import { ApiTokenButton, ApiTokenPrompt } from './token-prompt';
import { ChartGroup, Grid, Button, GridItem, NerdGraphQuery, NerdGraphMutation } from 'nr1';


const VERSION_A_DESCRIPTION = 'The newsletter signup message says, "Sign up for our newsletter"'
const VERSION_B_DESCRIPTION = 'The newsletter signup message says, "Sign up for our newsletter and get a free shirt!"'

export default class AbTestNerdletNerdlet extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            hideTokenPrompt: true,
            token: null,
        }

        this.storeToken = this.storeToken.bind(this);
        this.showPrompt = this.showPrompt.bind(this);
        this.hidePrompt = this.hidePrompt.bind(this);
    }

    storeToken(newToken) {
        if (newToken != this.state.token) {
            const mutation = `
                mutation($key: String!, $token: SecureValue!) {
                    nerdStorageVaultWriteSecret(
                        scope: { actor: CURRENT_USER }
                        secret: { key: $key, value: $token }
                    ) {
                        status
                        errors {
                            message
                            type
                        }
                    }
                }
            `;
            const variables = {
                key: "api_token",
                token: newToken,
            };

            NerdGraphMutation.mutate({ mutation: mutation, variables: variables }).then(
                (data) => {
                    if (data.data.nerdStorageVaultWriteSecret.status === "SUCCESS") {
                        this.setState({ token: newToken })
                    }
                }
            ).catch(err => {
                console.log('error saving token');
            });
        }
    }

    showPrompt() {
        this.setState({ hideTokenPrompt: false });
    }

    hidePrompt() {
        this.setState({ hideTokenPrompt: true });
    }

    componentDidMount() {
        const query = `
            query($key: String!) {
                actor {
                    nerdStorageVault {
                        secret(key: $key) {
                            value
                        }
                    }
                }
            }
        `;
        const variables = {
            key: "api_token",
        };

        NerdGraphQuery.query(
            {
                query: query,
                variables: variables,
            }
        ).then(
            ({ loading, error, data }) => {
                if (error) {
                    console.error(error);
                    this.showPrompt();
                }

                if (data && data.actor.nerdStorageVault.secret) {
                    this.setState({ token: data.actor.nerdStorageVault.secret.value })
                } else {
                    this.showPrompt();
                }
            }
        )
    }

    render() {
        return (
            <>
                <ApiTokenPrompt
                    hideTokenPrompt={this.state.hideTokenPrompt}
                    hidePrompt={this.hidePrompt}
                    showPrompt={this.showPrompt}
                    storeToken={this.storeToken}
                />
                <Grid className="wrapper">
                    <GridItem columnSpan={6}>
                        <VersionDescription
                            description={VERSION_A_DESCRIPTION}
                            version="A"
                        />
                    </GridItem>
                    <GridItem columnSpan={6}>
                        <VersionDescription
                            description={VERSION_B_DESCRIPTION}
                            version="B"
                        />
                    </GridItem>
                    <GridItem columnSpan={12}>
                        <AbTesting></AbTesting>
                    </GridItem>
                    <GridItem columnSpan={6}>
                        <TotalCancel token={this.state.token}></TotalCancel>
                    </GridItem>
                    <GridItem columnSpan={6}>
                        <TotalSub></TotalSub>
                    </GridItem>
                    <GridItem columnSpan={6}>
                        <Totals version="a" />
                    </GridItem>
                    <GridItem columnSpan={6}>
                        <Totals version="b" />
                    </GridItem>
                    <GridItem columnSpan={12}>
                        <EndTest
                            versionADescription={VERSION_A_DESCRIPTION}
                            versionBDescription={VERSION_B_DESCRIPTION}
                        />
                    </GridItem>
                    <GridItem columnSpan={12}>
                        <PastTests />
                    </GridItem>
                    <GridItem columnSpan={12}>
                        <ChartGroup>
                            <PageViews version="a" />
                            <PageViews version="b" />
                        </ChartGroup>
                    </GridItem>
                    <GridItem columnSpan={12} style={{ margin: 'auto', padding: '20px' }}>
                        <ApiTokenButton showPrompt={this.showPrompt} />
                    </GridItem>
                </Grid>
            </>);
    }
}
