<style lang="less" scoped>
#goodsDetail {
  padding: 20px;
  .goodsImg {
    width: 400px;
    img {
      display: block;
      width: 100%;
    }
  }
  .name {
    font-size: 22px;
    font-weight: blod;
    color: #333;
  }
  .comment {
    margin-top: 30px;
  }
}
.pay-type {
  margin-top: 20px;
  button {
    margin-right: 20px;
  }
}
.label {
  display: inline-block;
  width: 82px;
  margin-right: 10px;
  text-align: right;
}
</style>

<template>
  <div id="goodsDetail">
    <div class="clear">
      <div v-for="item in goodsDetail.picUrls" :key="item">
            <div class="goodsImg">
              <img :src="baseFileUrl + item">
            </div>
          </div>
      <div>
        <p class="name">name：{{goodsDetail.name}}</p>
        <p class="desc">desc：{{goodsDetail.desc}}</p>
        <p class="rentalCost">rentalCost：{{goodsDetail.rentalCost}}</p>
        <p class="deposit">deposit：{{goodsDetail.deposit}}</p>
        <p class="type">type：{{goodsDetail.typeName}}</p>
        <p class="addr">addr：{{goodsDetail.addr}}</p>
        <Button style="margin-top: 20px;" type="primary" @click="borrow = true">Borrow good</Button>
      </div>
    </div>
    <div class="comment">
      <p>comments:</p>
      <ul>
        <li v-for="item in commentList" :key="item" style="margin-bottom: 15px;">
          <p>
            <span style="margin-right: 20px">{{item.userName}}</span>
            <span>{{format(item.date)}}</span>
          </p>
          <p>{{item.comment}}</p>
        </li>
      </ul>
      <Input v-model="comment" type="textarea" placeholder="Enter something comment..."/>
      <Button style="margin-top: 20px;" type="primary" @click="commentSubmit">Submit</Button>
    </div>
    <Modal v-model="borrow" title="Borrow good" :loading="borrowLoading" @on-ok="ok" @on-cancel="cancel" okText="ok" cancelText="cancel">
      <div style="margin-top: 15px;">
        <span class="label">Rented good：</span>
        <span>{{goodsDetail.name}}</span>
      </div>
      <div style="margin-top: 15px;">
        <span class="label">Rental date：</span>
        <DatePicker
          v-model="rentalTime"
          :options="rentedOptions"
          @on-change="changeTime"
          type="daterange"
          placeholder="Select date"
          style="width: 200px"
        ></DatePicker>
      </div>
      <div style="margin-top: 15px;">
        <span class="label">rentalCost：</span>{{goodsDetail.rentalCost * totalDays}}
      </div>
       <div style="margin-top: 15px;">
        <span class="label">deposit：</span>{{goodsDetail.deposit}}
      </div>
      <div style="margin-top: 15px;">
        <span class="label">total price：</span>{{goodsDetail.deposit + goodsDetail.rentalCost * totalDays}}
      </div>
      <div class="pay-type">
        <span class="label">payType：</span>
        <Button
          v-for="item in payType"
          :key="item"
          :type="curPayType === item ? 'success' : ''"
          @click="curPayType = item"
        >{{item}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getGoodsDetail, getGoodsComment, comment, order } from "@/api/data";
import { getDate } from "@/libs/tools";
export default {
  data() {
    return {
      baseFileUrl: "http://47.107.166.120:8000/hw/files/",
      goodsId: "",
      goodsDetail: {},
      likes: null,
      owner: null,
      comment: "",
      commentList: [],
      borrow: false,
      borrowLoading: true,
      payType: ["visa", "mastercard", "amex"],
      curPayType: "",
      rentalTime: [],
      rentedOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      totalDays: 0
    };
  },
  methods: {
    getGoodsById(id) {
      let self = this;
      getGoodsDetail(id)
        .then(function(res) {
          console.log(res);
          self.goodsDetail = res.data.data.goods;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getCommentList() {
      let self = this;
      getGoodsComment(self.goodsId)
        .then(function(res) {
          self.commentList = res.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    commentSubmit() {
      let self = this;
      if (self.comment === "") {
        self.$Message.error("Please enter something comment...");
        return;
      }
      comment(self.goodsId, { comment: self.comment })
        .then(function(res) {
          console.log("comment", res.data);
          self.comment = '';
          self.getCommentList();
        })
        .catch(function(error) {
          console.log(1112)
        });
    },
    format(time) {
      return getDate(new Date(time).getTime() / 1000, "year");
    },
    changeTime() {
      this.countDays();
    },
    countDays() {
      let self = this;
      let time_interval = new Date(self.rentalTime[1]) - new Date(self.rentalTime[0])
      return self.totalDays = time_interval/86400000 + 1;
    },
    ok() {
      let self = this;
      if(self.rentalTime[0] === '') {
         this.$Message.error('please choose rentalTime');
         self.borrowLoading = false;
         setTimeout(()=>{
           self.borrowLoading = true;
         },0)
         return;
      }
      console.log(self.curPayType)
      if(self.curPayType === '') {
        this.$Message.error('please choose payType');
         self.borrowLoading = false;
         setTimeout(()=>{
           self.borrowLoading = true;
         },0)
         return;
      }
      self.countDays();
      order({
          goodsId: self.goodsId,
          payType: self.curPayType,
          rentStart: `${new Date(self.rentalTime[0]).getFullYear()}-${new Date(self.rentalTime[0]).getMonth() + 1}-${new Date(self.rentalTime[0]).getDate()}`,
          rentEnd: `${new Date(self.rentalTime[1]).getFullYear()}-${new Date(self.rentalTime[1]).getMonth() + 1}-${new Date(self.rentalTime[1]).getDate()}`,
        })
        .then(function(res) {
          console.log(res);
          self.borrow = false;

        })
        .catch(function(error) {
          console.log(error);
        });
    },
    cancel() {

    }
  },
  mounted() {
    this.goodsId = this.$route.params.id;
    this.getGoodsById(this.$route.params.id);
    this.getCommentList();
  }
};
</script>

<style>
</style>
