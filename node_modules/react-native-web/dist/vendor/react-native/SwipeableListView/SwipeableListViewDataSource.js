/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule SwipeableListViewDataSource
 */
'use strict';

import ListViewDataSource from '../ListView/ListViewDataSource';
/**
 * Data source wrapper around ListViewDataSource to allow for tracking of
 * which row is swiped open and close opened row(s) when another row is swiped
 * open.
 *
 * See https://github.com/facebook/react-native/pull/5602 for why
 * ListViewDataSource is not subclassed.
 */

var SwipeableListViewDataSource =
/*#__PURE__*/
function () {
  function SwipeableListViewDataSource(params) {
    var _this = this;

    this._dataSource = new ListViewDataSource({
      getRowData: params.getRowData,
      getSectionHeaderData: params.getSectionHeaderData,
      rowHasChanged: function rowHasChanged(row1, row2) {
        /**
         * Row needs to be re-rendered if its swiped open/close status is
         * changed, or its data blob changed.
         */
        return row1.id !== _this._previousOpenRowID && row2.id === _this._openRowID || row1.id === _this._previousOpenRowID && row2.id !== _this._openRowID || params.rowHasChanged(row1, row2);
      },
      sectionHeaderHasChanged: params.sectionHeaderHasChanged
    });
  }

  var _proto = SwipeableListViewDataSource.prototype;

  _proto.cloneWithRowsAndSections = function cloneWithRowsAndSections(dataBlob, sectionIdentities, rowIdentities) {
    this._dataSource = this._dataSource.cloneWithRowsAndSections(dataBlob, sectionIdentities, rowIdentities);
    this._dataBlob = dataBlob;
    this.rowIdentities = this._dataSource.rowIdentities;
    this.sectionIdentities = this._dataSource.sectionIdentities;
    return this;
  } // For the actual ListView to use
  ;

  _proto.getDataSource = function getDataSource() {
    return this._dataSource;
  };

  _proto.getOpenRowID = function getOpenRowID() {
    return this._openRowID;
  };

  _proto.getFirstRowID = function getFirstRowID() {
    /**
     * If rowIdentities is specified, find the first data row from there since
     * we don't want to attempt to bounce section headers. If unspecified, find
     * the first data row from _dataBlob.
     */
    if (this.rowIdentities) {
      return this.rowIdentities[0] && this.rowIdentities[0][0];
    }

    return Object.keys(this._dataBlob)[0];
  };

  _proto.getLastRowID = function getLastRowID() {
    if (this.rowIdentities && this.rowIdentities.length) {
      var lastSection = this.rowIdentities[this.rowIdentities.length - 1];

      if (lastSection && lastSection.length) {
        return lastSection[lastSection.length - 1];
      }
    }

    return Object.keys(this._dataBlob)[this._dataBlob.length - 1];
  };

  _proto.setOpenRowID = function setOpenRowID(rowID) {
    this._previousOpenRowID = this._openRowID;
    this._openRowID = rowID;
    this._dataSource = this._dataSource.cloneWithRowsAndSections(this._dataBlob, this.sectionIdentities, this.rowIdentities);
    return this;
  };

  return SwipeableListViewDataSource;
}();

export default SwipeableListViewDataSource;