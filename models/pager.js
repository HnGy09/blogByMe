/**
 * Created by Gaoyang on 2018/8/30.
 */
"use strict";
function Pager(pager) {
    this.currentPage = pager.currentPage;
    this.totalPages = pager.totalPages;
    this.viewCount = pager.viewCount;
}

module.exports = Pager;