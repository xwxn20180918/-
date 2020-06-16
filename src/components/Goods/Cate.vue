<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-button type="success" @click="isShowCate">添加商品</el-button>
      </el-row>
      <!-- 树型列表 -->
      <tree-table
        class="tree_table"
        border
        :data="cateList"
        :columns="columns"
        show-index
        :expand-type="false"
        :selection-type="false"
      >
        <template slot="likes" slot-scope="scope">
          <i
            style="color:green;"
            class="el-icon-circle-check"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i style="color:red;" class="el-icon-circle-close" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="option" slot-scope>
          <el-button type="primary" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querys.pagenum"
        :page-sizes="[2, 4, 6, 10]"
        :page-size="querys.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="adddialogVisible" width="50%" @close="addCateClosed">
      <!-- 添加表单 -->
      <el-form :model="addruleForm" :rules="addruleFormrules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader :props="cascaderProps" clearable filterable
            v-model="selectedKeys"
            :options="parentCateList"
             expand-trigger= 'hover'
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品列表数据
      cateList: [],
      //请求参数
      querys: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //总条数
      total: 0,
      //tree每个列数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "likes"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "option"
        }
      ],
      //添加分类对话框默认不显示
      adddialogVisible: false,
      //添加商品数据
      addruleForm: {
        //分类mingc
        cat_name: "",
        //分类父 ID
        cat_pid: 0,
        //分类层级
        cat_level: 0
      },
      //添加商品规则
      addruleFormrules: {
        cat_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      //父级分类数据（只有两级）
      parentCateList: [],
      //指定级联选择器对象
        cascaderProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        //选中父级分类的id数组
        selectedKeys:[]
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data } = await this.$http.get("categories", {
        params: this.querys
      });
      if (data.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      //  console.log(data.data)
      this.cateList = data.data.result;
      this.total = data.data.total;
    },
    //监听当前pagesize改变  分页
    handleSizeChange(newSize) {
      this.querys.pagesize = newSize;
      //刷新数据
      this.getCateList();
    },
    //监听当前 pagenum改变 分页
    handleCurrentChange(newPage) {
      this.querys.pagenum = newPage;
      //刷新数据
      this.getCateList();
    },
    //点击是否显示天添加分类对话框
    isShowCate() {
      //显示分类列表时 得到父级列表数据
      this.getParentCateList();
      this.adddialogVisible = true;
    },
    //获取父级分类列表
    async getParentCateList() {
      const { data } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (data.meta.status !== 200) {
        return this.$message.error("获取父级节点失败");
      }
      this.parentCateList = data.data;
      console.log(data.data);
    },
    //选择项发生变化触发这个函数
    handleChange(){
      console.log(this.selectedKeys)
      //如果当selectedKeys数组length大于0时 则表示选中了父级分类
      //如果没有 则表示没有选中父级
      if(this.selectedKeys.length > 0){
        //当前父级id
        this.addruleForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1] 
        //当前父级等级
        this.addruleForm.cat_level =  this.selectedKeys.length  
      }else{
        this.addruleForm.cat_pid = 0
        this.addruleForm.cat_level =0
      }
    },
    //点击按钮 添加新分类
    addCate(){
      // console.log(this.addruleForm)
      this.$refs.ruleFormRef.validate(async valid => {
        if(!valid){
          return this.$message.error('验证失败')
        }
          //发起添加分类请求
         const {data} = await this.$http.post('categories',this.addruleForm)
         if(data.meta.status !== 201){
           return this.$message.error('添加分类失败')
         }
           this.$message.success('添加分类成功')
           this.getCateList()
           this.adddialogVisible = false
      })
    },
    //点击添加对话框的取消按钮 重置表单数据
    addCateClosed(){
      //重置第一个表单
      this.$refs.ruleFormRef.resetFields()
      //重置vmodel绑定的数组
      this.selectedKeys = []
      //一定要再次清楚 fenlei的父id  和层级 让其空间干净 不会影响后续操作
      this.addruleForm.cat_pid = 0
      this.addruleForm.cat_level =0

    }
  },
  components: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';

.el-card {
  margin-top: 15px;

  .tree_table {
    margin-top: 15px;
  }
}

//解决高度太高的问题
.el-cascader-menu {
    height: 300px;
}
.el-cascader{
    width: 100%;
}

</style>
