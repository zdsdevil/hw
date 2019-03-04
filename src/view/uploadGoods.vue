<style lang="less" scoped>
#uploadGoods {
  padding: 20px;
  width: 60%;
  margin: auto;
  .demo-upload-list {
    display: inline-block;
    width: 102px;
    height: 102px;
    text-align: center;
    line-height: 102px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
  }
  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }
  .demo-upload-list-cover i {
    line-height: 100px;
    color: #fff;
    font-size: 32px;
    cursor: pointer;
    margin: 0 2px;
  }
}
</style>

<template>
  <div id="uploadGoods">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="img" prop="img">
      <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
        <template v-if="item.status === 'finished'">
          <img :src="item.url">
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
      <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        :headers="headers"
        type="drag"
        action="hw/security/pic"
        style="display: inline-block;width:100px;"
      >
        <div style="width: 100px;height:100px;line-height: 100px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </Upload>
      <Modal class="previewImg" v-model="visible">
        <p slot="header" style="color:#f60;text-align:center">
          <span>View Image</span>
        </p>
        <img
          :src="'http://47.107.166.120:8000/hw/files/' + imgName"
          v-if="visible"
          style="width: 100%"
        >
        <div slot="footer"></div>
      </Modal>
    </FormItem>
      <FormItem label="name" prop="name">
        <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
      </FormItem>
      <FormItem label="deposit" prop="deposit">
        <Input type="number" v-model="formValidate.deposit" placeholder="Enter your deposit"></Input>
      </FormItem>
      <FormItem label="rentalCost" prop="rentalCost">
        <Input type="number" v-model="formValidate.rentalCost" placeholder="Enter your rentalCost"></Input>
      </FormItem>
      <FormItem label="type" prop="type">
        <Select v-model="formValidate.type" placeholder="Select type">
          <Option v-for="(item,index) in goodsTypeList" :key="index" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="addr" prop="addr">
        <Input v-model="formValidate.addr" placeholder="Enter your addr"></Input>
      </FormItem>
      <FormItem label="desc" prop="desc">
        <Input
          v-model="formValidate.desc"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}"
          placeholder="Enter something..."
        ></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { getGoodsType, uploadGoods } from '@/api/data'
import { getToken } from '@/libs/util'

export default {
  data () {
    return {
      headers: {},
      formValidate: {
        addr: '',
        deposit: '',
        desc: '',
        name: '',
        rentalCost: '',
        type: '',
        city: ''
      },
      goodsTypeList: [],
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      cur_uploadImg: null,
      ruleValidate: {
        deposit: [
          {
            required: true,
            message: 'deposit cannot be empty',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: 'The name cannot be empty',
            trigger: 'blur'
          }
        ],
        rentalCost: [
          {
            required: true,
            message: 'rentalCost cannot be empty',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      let self = this
      if (self.uploadList.length === 0) {
        self.$Message.error('Please upload at least one picture')
        return
      }
      self.$refs[name].validate(valid => {
        if (valid) {
          let picUrls = self.uploadList.map(item => {
            return item.name
          })
          console.log(picUrls)
          uploadGoods({
            addr: self.formValidate.addr,
            deposit: parseFloat(self.formValidate.deposit),
            desc: self.formValidate.desc,
            name: self.formValidate.name,
            rentalCost: parseFloat(self.formValidate.rentalCost),
            type: parseFloat(self.formValidate.type),
            picUrls: picUrls
          })
            .then(function (res) {
              console.log('res', res.data)
              if (res.data.msg === 'success') {
                self.$Message.success(res.data.msg)
                self.handleReset('formValidate')
                self.$refs.upload.fileList.splice(0, self.$refs.upload.fileList.length)
              } else {
                self.$Message.error(res.data.msg)
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      file.url = 'http://47.107.166.120:8000/hw/files/' + res.data
      file.name = res.data
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc:
          'File format of ' +
          file.name +
          ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    }
  },
  mounted () {
    let self = this
    self.headers['hw-token'] = getToken()
    self.uploadList = self.$refs.upload.fileList
    getGoodsType().then(res => {
      console.log(res)
      self.goodsTypeList = res.data.data
    })
  }
}
</script>
