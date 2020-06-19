<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert title="消息提示的文案" type="info" center show-icon></el-alert>
      <!-- 步骤条 -->

      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- left tab标签 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="ruleFormRfs"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="toggleActiveTabs"
          @tab-click="toggleTabs"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_name">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                style="width:30%;"
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,index) in this.manyTableData"
              :key="index.attr_id"
              :index="item.attr_id"
            >
              <el-checkbox-group v-model="manyTableData">
                <el-checkbox
                  style="margin:0 10px 0 0;"
                  border
                  :label="i"
                  v-for="(i,index) in item.attr_vals"
                  :key="index.id"
                  :index="i.id"
                >{{i}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="o.attr_name"
              v-for="(o,index) in onlyTableDate"
              :index="o.attr_id"
              :key="index.attr_id"
            >
              <el-input v-model="o.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示要上传的图片地址 -->
            <el-upload
              :headers="headersObj"
              :on-success="handleSuccess"
              :action="upLoad"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ></quill-editor>
            <el-button type="primary" style="margin:15px 0 0 0;" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="isShowdialogVisible" width="50%">
      <img :src="urlPath" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      //默认active 当前状态
      activeIndex: "0",
      //表单数据
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        //商品所属的分类列表
        goods_cat: [],
        //图片所属的数组
        pics: [],
        //商品介绍
        goods_introduce:'',
        //动态参数和静态参数的数组
        attrs:[]
        
      },
      //表单规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },
      //获取商品分类数据
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //动态参数列表
      manyTableData: [],
      //静态属性列表
      onlyTableDate: [],
      //上传得图片地址
      upLoad: "http://127.0.0.1:8888/api/private/v1/upload",
      //图片上传组件headers请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      //预览图片地址
      urlPath: "",
      //预览对话框默认不显示
      isShowdialogVisible:false
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data } = await this.$http.get("categories");
      if (data.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.$message.success("获取商品分类成功");
      this.cateList = data.data;
      console.log(this.cateList);
    },
    //级联选择器 选中项发生变化   会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = []);
      }
    },
    //在级联选择器 中 商品length为3 时 切换tabs
    //activeName == '1' oldActiveName  == '0'
    toggleActiveTabs(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    //点击切换tabs 当activeIndex === 1 时切换
    async toggleTabs() {
      if (this.activeIndex === "1") {
        //获取动态参数列表
        const { data } = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (data.meta.status !== 200) {
          return this.$message.error("获取商品失败");
        }
        this.$message.success("获取商品列表成功");
        this.manyTableData = data.data;
        data.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length > 0 ? item.attr_vals.split(" ") : [];
        });
        console.log(this.manyTableData);
      } else if (this.activeIndex === "2") {
        //获取静态参数列表
        const { data } = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (data.meta.status !== 200) {
          return this.$message.error("获取商品失败");
        }
        this.$message.success("获取商品列表成功");
        this.onlyTableDate = data.data;
        console.log(this.onlyTableDate);
      }
    },
    //点击显示 点击预览图片时 可以打印对象 console.log(file)
    handlePreview(file) {
      console.log(file);
      //得到当前图片的ptah
      this.urlPath = file.response.data.url;
      this.isShowdialogVisible = true
    },
    //点击移除图片 点击删除时 可以打印对象 console.log(file)
    handleRemove(file) {
      console.log(file);
      //1 获取将要删除图片的；临时位置
      const fliePath = file.response.data.tmp_path;
      //在pics中数组中 找到对应的index
      const itemIndex = this.addForm.pics.findIndex(item => {
        item.pic === fliePath;
      });
      //删除
      this.addForm.pics.splice(itemIndex, 1);
      console.log(this.addForm);
    },
    //图片上传成功的事件上传成功可以打印对象 console.log(response)
    handleSuccess(response) {
      // console.log(response)
      //得到当前图片的位置
      const picInfo = { pic: response.data.tmp_path };
      //添加到pices数组中
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    //点击添加商品
    add(){
      //首先进行校验证
      this.$refs.ruleFormRfs.validate(async valid =>{
        if(!valid){
          return this.$message.error('请输入必填项')
        }
        //发起添加商品请求
        //在这之前 先把goods_cat 用join（','）转化为字符串
        //转化为字符串时 因为级联选择器对象支持数组 所以对addForm进行深拷贝
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          //取出manyTableData中的 attr_id attr_value
          this.manyTableData.forEach(item => {
            const manyInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
            this.addForm.attrs.push(manyInfo)
          })
          //取出onlyTableData中的 attr_id attr_value
          this.onlyTableDate.forEach(item => {
            const onlyInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
            this.addForm.attrs.push(onlyInfo)
          })
          //最后把数据赋值给form
          form.attrs = this.addForm.attrs
          console.log(form)
          //发送请求添加商品
         const {data} = await this.$http.post('goods',form)
         if(data.meta.status !== 201){
           return this.$message.error('添加失败')
         }
           this.$message.success('添加商品成功')
           this.$router.push('/goods')
      })
    }
  },
  computed: {
    //获取三级列表的id
    getCateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  components: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
