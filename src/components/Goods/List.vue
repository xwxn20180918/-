<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            width="30%"
            v-model="paramsStr.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="addList">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe style="margin:15px 0 0 0;">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px"></el-table-column>
         <el-table-column prop="goods_number" label="商品数量" width="120px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">{{scope.row.add_time | date-format}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeListId(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsStr.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="paramsStr.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- c对话框 -->
    <el-dialog title="编辑商品信息" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editDialogRuleForm"
        :rules="editDialogRuleFormrules"
        ref="editRuleFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editDialogRuleForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editDialogRuleForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editDialogRuleForm.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editDialogRuleForm.goods_number" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品列表数据
      goodsList: [],
      //总页数
      total: 0,
      //params参数
      paramsStr: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      //是否显示编辑对话框
      editDialogVisible: false,
      //修改对话框表单数据
      editDialogRuleForm: {
      },
      //修改表单规则
      editDialogRuleFormrules: {
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
          { required: true, message: "商品数量", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data } = await this.$http.get("goods", {
        params: this.paramsStr
      });
      if (data.meta.status !== 200) {
        return this.$message.error("获取列表失败");
      }
      this.$message.success("获取商品数据成功");
      this.goodsList = data.data.goods;
      this.total = data.data.total;
      console.log(this.goodsList);
    },
    //当前的pagesize
    handleSizeChange(newPage) {
      this.paramsStr.pagesize = newPage;
      this.getGoodsList();
    },
    //当前的pagenum
    handleCurrentChange(NewNum) {
      this.paramsStr.pagenum = NewNum;
      this.getGoodsList();
    },
    //删除当前数据
    async removeListId(id) {
      //弹框提示
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.error("点击了取消");
      }
      //点击确定 发送删除请求
      const { data } = await this.$http.delete(`goods/${id}`);
      if (data.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除商品成功");
      this.getGoodsList();
    },
    //添加商品按钮 跳转路由
    addList() {
      this.$router.push("/add");
    },
    //点击编辑按钮 显示编辑对话框
    async editDialog(id) {
      console.log(id);
      //先获取商品信息
      const { data } = await this.$http.get("goods/" + id);
      if (data.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      console.log(data.data);
      this.editDialogRuleForm = data.data;

      this.editDialogVisible = true;
    },
    //修改商品信息
    edit() {
      //进行表单校验
      this.$refs.editRuleFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        //发送请求修改请求
        
        const { data } = await this.$http.put(
          "goods/" + this.editDialogRuleForm.goods_id,
          {
            goods_name: this.editDialogRuleForm.goods_name,
            goods_price: this.editDialogRuleForm.goods_price,
            goods_weight: this.editDialogRuleForm.goods_weight,
            goods_number: this.editDialogRuleForm.goods_number,
          }
        );
        console.log(data);
        if (data.meta.status !== 201) {
          return this.$message.error("编辑失败");
          
        }
        
        this.$message.success("编辑成功");
        this.getGoodsList();
        this.editDialogVisible = false;
      });
    }
  },
  components: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
