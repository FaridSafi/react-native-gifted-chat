import React, { Component } from 'react';
import {
  ListView,
} from 'react-native';

import ListRow from './ListRow';

export default class List extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillMount() {
    this.updateListView(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateListView(nextProps);
  }

  updateListView(props) {
    if (props.rows) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(props.rows),
      });
    }
  }

  renderRow(row = {}) {
    if (this.props.renderRow) {
      return this.props.renderRow(row);
    }
    return (
      <ListRow
        primaryText={row.primaryText}
      />
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderHeader={this.props.renderHeader}
        enableEmptySections={true}
      />
    );
  }
}
