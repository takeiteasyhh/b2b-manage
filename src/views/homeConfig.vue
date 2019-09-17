<template>
  <div>
    <div class="tab">
      <i class="icon iconfont iconqita"></i>
      <span>首頁管理</span>
    </div>

    <div class="whiteBac">
      <div v-for="(form,index) in formList" :key="index">
        <el-row style="min-width: 600px;">
          <el-col :span="14">
            <el-form
              :model="form"
              ref="form"
              :rules="rule"
              label-width="100px"
              label-position="left"
            >
              <el-form-item label="選擇類型：" prop="type">
                <el-select v-model="form.type" filterable placeholder="請選擇">
                  <el-option
                    v-for="item in goodsTypeOpts"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上傳圖片">
                <el-upload
                  class="avatar-uploader"
                  :action="imgUploadUrl"
                  :show-file-list="false"
                  :on-success="function(res,file){return handleImg(res,file,index)}"
                  :before-upload="function(file){return beforeUpload(file,index)} "
                >
                  <img v-if="form.image" :src="baseImgPath + form.image" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>

              <el-form-item label="標題：" prop="title">
                <el-input type="text" v-model="form.title" maxlength="15" show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="內容：" prop="content">
                <el-input type="text" v-model="form.content" maxlength="20" show-word-limit></el-input>
              </el-form-item>

              <el-form-item v-if="formList.length>1">
                <el-button type="danger" plain @click="deleteItem(index)">刪除此項</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div class="line"></div>
      </div>
      <el-row>
        <el-col :span="14">
          <el-button type="primary" plain @click="addItem()" class="fr">
            <i class="el-icon-plus"></i>
            添加輪播圖
          </el-button>
        </el-col>
      </el-row>

      <div style="padding:20px 0">
        <el-button type="primary" @click="save('form')">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config/config.js";
export default {
  data() {
    return {
      baseImgPath: config.IMAGE_URL,
      imgUploadUrl: config.IMAGE_URL + "uploadImage",
      goodsTypeOpts: this.$codeMap.goodsTypeOpt,
      formList: [{ type: null, title: "", image: "", content: "" }],

      rule: {
        type: [{ required: true, message: "請選擇類型", trigger: "change" }],
        title: [{ required: true, message: "請輸入標題", trigger: "blur" }],
        content: [{ required: true, message: "請輸入內容", trigger: "blur" }]
      }
    };
  },
  activated() {
    this.getList();
  },
  methods: {
    //獲取表單
    getList() {
      let params = {
        key: "homeBanner",
        _t: new Date().getTime()
      };

      let url = "config/" + params.key;
      this.getAxios(url, params).then(res => {
        if (res.success) {
          if (res.data && res.data.config) {
            if (typeof res.data.config == "string") {
              let _data = JSON.parse(res.data.config);
              if (Array.isArray(_data) && _data.length) {
                //已有數據
                this.formList = _data;
              }
            }
          }
        } else {
          this.$message.error(
            this.$codeMap.codeMap[String(res.code)] || res.message
          );
        }
      });
    },
    handleImg(response, file, index) {
      if (response.success && response.data.url) {
        this.formList[index].image = response.data.url;
      } else {
        this.$message.error("上传图片失败！");
      }
    },

    //上传的图片 类型和大小校验
    beforeUpload(file, index) {
      const isRightType =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt10M = file.size / 1024 / 1024 < 12;

      if (!isRightType) {
        this.$message.error("上傳的圖片只能是 JPG/png 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上傳的圖片大小不能超過 12MB!");
      }
      return isRightType && isLt10M;
    },
    // 刪除一項
    deleteItem(index) {
      this.formList.splice(index, 1);
    },
    // 增加一項
    addItem() {
      this.formList.push({ type: null, title: "", image: "", content: "" });
    },

    // 保存處理
    save(name) {
      let _this = this;
      let newArr = []; //承接promise的返回结果
      //根据form表单的ref，动态生成promise，再对其坐表单校验，都通过了再去做处理
      this.formList.forEach((item, index) => {
        var result = new Promise(function(resolve, reject) {
          _this.$refs[name][index].validate(valid => {
            if (valid) {
              resolve();
              if (!item.image) {
                _this.$message({
                  message: "請上傳圖片",
                  type: "warning"
                });
                reject();
              } else {
                resolve();
              }
            } else {
              reject();
            }
          });
        });
        newArr.push(result); //push 得到promise的结果
      });

      //都通过校驗，保存所有表單
      Promise.all(newArr)
        .then(() => {
          console.log("恭喜，表单全部验证通过");
          let params = {
            key: "homeBanner"
          };
          params.config = JSON.stringify(this.formList);
          console.log(JSON.stringify(this.formList));

          this.postAxios("config", params).then(res => {
            if (res.success) {
              this.$message({ message: "修改成功", type: "success" });
            } else {
              this.$message({
                message: this.$codeMap.codeMap[String(res.code)] || res.message,
                type: "warning"
              });
            }
          });
        })
        .catch(() => {
          console.log("error");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.line {
  margin: 20px;
  border-top: 2px dashed rgba(224, 229, 237, 1);
}
</style>