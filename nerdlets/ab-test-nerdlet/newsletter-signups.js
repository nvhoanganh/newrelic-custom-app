import React from 'react';
import {
  navigation, Button, NrqlQuery, LineChart, HeadingText, PlatformStateContext, Stack,
  StackItem,
} from 'nr1';

const ACCOUNT_ID = 3293563
const ENTITY_GUID = 'MzI5MzU2M3xBUE18QVBQTElDQVRJT058MTQxMTI3MTMwNQ'
export default class NewsletterSignups extends React.Component {
  openAPMEntity() {
    navigation.openStackedEntity(ENTITY_GUID)
  }

  render() {
    return <>
      <Stack fullWidth>
        <StackItem grow={true}>
          <HeadingText className="chartHeader">
            Newsletter subscriptions per version
          </HeadingText>
        </StackItem>
        <StackItem>
          <Button onClick={this.openAPMEntity}>
            App performance
          </Button>
        </StackItem>
      </Stack>
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
                  return <LineChart data={data} fullWidth />;
                }
              }
            </NrqlQuery>
          }
        }
      </PlatformStateContext.Consumer>
    </>

  }
}