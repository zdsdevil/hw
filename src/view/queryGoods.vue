<style lang="less">
#queryGoods {
  width: 100%;
  padding: 10px;
  .goodsCard {
    img {
      display: block;
      width: 100%;
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

<template>
  <div id="queryGoods">
    <Form ref="formValidate" :model="formValidate" :label-width="80" inline>
      <FormItem label="type" prop="type" style="width: 250px">
        <Select v-model="formValidate.type" placeholder="Select type">
          <Option v-for="(item,index) in goodsTypeList" :key="index" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="goodsName" prop="goodsName">
        <Input v-model="formValidate.goodsName" placeholder="Enter goodsName"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="Search">Search</Button>
      </FormItem>
    </Form>
    <Row style="padding:20px">
      <Col
        span="4"
        v-for="(item,index) in goodsData"
        :key="index"
        :offset="(index % 5 !== 0) ? 1 : 0"
      >
        <Card class="goodsCard" @click="goodsDetail(item)">
          <div>
            <img v-if="item.picUrls && item.picUrls.length > 0" :src="baseFileUrl + item.picUrls[0]">
            <p class="name fs-18 f-c2">{{item.name}}</p>
            <p class="desc">{{item.desc}}</p>
            <p class="rentalCost">rentalCost：{{item.rentalCost}}</p>
            <p class="deposit">deposit：{{item.deposit}}</p>
            <p class="type">{{item.type}}</p>
            <p class="addr">{{item.addr}}</p>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import { getGoodsType, queryGoods } from "@/api/data";

export default {
  data() {
    return {
      baseFileUrl: 'http://47.107.166.120:8000/hw/files/',
      formValidate: {
        type: "",
        goodsName: ""
      },
      goodsTypeList: [],
      goodsData: []
    };
  },
  methods: {
    Search() {
      let self = this;
      queryGoods(self.formValidate.type, self.formValidate.goodsName).then(function(res) {
          console.log(res.data);
          if (res.data.msg === "success") {
            self.goodsData = res.data.data;
          } else {
            self.$Message.error(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    goodsDetail(item) {
      this.$router.push('')
    }
  },
  mounted() {
    let self = this;
    getGoodsType().then(res => {
      console.log(res);
      self.goodsTypeList = res.data.data;
    });
  }
};
</script>
