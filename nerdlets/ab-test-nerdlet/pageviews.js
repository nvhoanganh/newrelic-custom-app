import React from 'react';
import { PlatformStateContext, HeadingText, LineChart, NrqlQuery } from 'nr1';

const ACCOUNT_ID = 3293563
export default class VersionPageViews extends React.Component {
  render() {
    return <>
      <HeadingText className="chartHeader">Page View for Version: {this.props.version}</HeadingText>
      <PlatformStateContext.Consumer>
        {
          (platformState) => {
            return <NrqlQuery
              accountId={ACCOUNT_ID}
              query="SELECT count(*) FROM subscription FACET page_version TIMESERIES"
              timeRange={platformState.timeRange}
              pollInterval={60000}
            >
              {
                ({ data }) => {
                  return <NrqlQuery
                    accountId={ACCOUNT_ID}
                    query={`SELECT count(*) FROM pageView WHERE page_version = '${this.props.version}' TIMESERIES`}
                    timeRange={platformState.timeRange}
                    pollInterval={60000}
                  >
                    {
                      ({ data }) => {
                        return <LineChart data={data} fullWidth />
                      }
                    }
                  </NrqlQuery>
                }
              }
            </NrqlQuery>
          }
        }
      </PlatformStateContext.Consumer>
    </>
  }
}