<template>
  <div id="index">
    <Input class="search" v-model="goodsKeyword">
      <Select
        v-model="searchGoodsType"
        slot="prepend"
        placeholder="Select type"
        style="width: 150px"
      >
        <Option v-for="(item,index) in goodsTypeList" :key="index" :value="item.id">{{item.name}}</Option>
      </Select>
      <Button slot="append" icon="ios-search" @click="Search(1)"></Button>
    </Input>
    <div class="search-result clear">
      <div
        class="fl"
        style="width: 18.4%;"
        :style="{marginLeft: (index % 5 !== 0) ? '2%' : 0}"
        v-for="(item,index) in searchResult"
        :key="index"
        @click="goodsDetail(item)"
      >
        <Card class="goodsCard">
          <div>
            <img
              v-if="item.picUrls && item.picUrls.length > 0"
              :src="baseFileUrl + item.picUrls[0]"
            >
            <p class="name fs-18 f-c2">{{item.name}}</p>
            <p class="desc" style="height: 44px">{{item.desc}}</p>
            <p class="rentalCost">rentalCost：{{item.rentalCost}}</p>
            <p class="deposit">deposit：{{item.deposit}}</p>
            <p class="type">type：{{item.typeName}}</p>
            <p class="addr">addr：{{item.addr}}</p>
          </div>
        </Card>
      </div>
    </div>
    <Page :total="total" :page-size="page_size" :current="curPage" @on-change="changePage" show-total/>
  </div>
</template>

<script>
import { getGoodsType, queryGoods } from "@/api/data";
export default {
  data() {
    return {
      baseFileUrl: "http://47.107.166.120:8000/hw/files/",
      goodsKeyword: "",
      searchGoodsType: "",
      goodsTypeList: [],
      searchResult: [],
      curPage: 1,
      total: 100,
      page_size: 10
    };
  },
  methods: {
    Search(page) {
      let self = this;
      queryGoods(self.searchGoodsType, self.goodsKeyword, self.page_size , page || 1)
        .then(function(res) {
          console.log(res.data);
          if (res.data.msg === "success") {
            self.searchResult = res.data.data.goods;
            self.curPage = res.data.data.pageNo;
            self.total = res.data.data.count;
          } else {
            self.$Message.error(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    goodsDetail(item) {
      this.$router.push(`/detail/${item.goodsId}`);
    },
    changePage(page) {
      this.Search(page);
    }
  },
  mounted() {
    let self = this;
    getGoodsType()
      .then(res => {
        console.log(res);
        self.goodsTypeList = res.data.data;
      })
      .then(() => {
        self.Search();
      });
  }
};
</script>

<style lang="less">
.search {
  width: 600px;
  margin: auto;
}
.search-result {
  padding: 20px 0;
  .goodsCard {
    margin-bottom: 20px;
    img {
      display: block;
      width: 100%;
      height: 100px;
    }
    .desc {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>
