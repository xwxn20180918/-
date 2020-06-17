<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <el-row>
        <el-col>
          <span class="params_span">当前商品分类：</span>
          <!-- 选择商品分类级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            style="width:20%;"
            v-model="selectedCateKeys"
            :options="CateList"
            :props="CateListProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button style="margin:0px 0px 15px 0px;"
            type="success"
            size="mini"
            :disabled="isBtnDisable"
            @click="isShowAddDialog"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="tagClosed(scope.row,index)"
                  style="margin:10px;"
                  closable
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                >{{item}}</el-tag>
                <el-input style="width:120px;"
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeDialog(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button style="margin:0px 0px 15px 0px;"
            type="success"
            size="mini"
            :disabled="isBtnDisable"
            @click="isShowAddDialog"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="tagClosed(scope.row,index)"
                  style="margin:10px;"
                  closable
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                >{{item}}</el-tag>
                <el-input style="width:120px;"
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeDialog(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数/静态属性对话框 -->
    <el-dialog
      :title="'添加'+this.ShowTittle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogVisibleClosed"
    >
      <!-- 添加表单 -->
      <el-form :model="AddForm" :rules="AddFormRules" ref="ruleFormRef" label-width="100px">
        <el-form-item :label="this.ShowTittle" prop="attr_name">
          <el-input v-model="AddForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改动态参数/静态属性对话框 -->
    <el-dialog
      :title="'修改'+this.ShowTittle"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogVisibleClosed"
    >
      <!-- 添加表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="ruleFormRef" label-width="100px">
        <el-form-item :label="this.ShowTittle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类数据
      CateList: [],
      //级联选择器的配置对象
      CateListProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //级联选择器双向绑定到的数组
      selectedCateKeys: [],
      //默认显示的标签
      activeName: "many",
      //动态参数数据
      manyTableData: [],
      //静态属性数据
      onlyTableData: [],
      //是否显示添加参数对话框
      addDialogVisible: false,
      //添加表单数据对象
      AddForm: {},
      //表单验证规则
      AddFormRules: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      //是否显示修改数据对话框
      editDialogVisible: false,
      //修改表单的数据对象
      editForm: {
        attr_name: ""
      },
      //修改表单规则对象
      editFormRules: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data } = await this.$http.get("categories");
      if (data.meta.status !== 200) {
        return this.$meesage.error("获取分类列表失败");
      }
      this.CateList = data.data;
      console.log(data.data);
    },
    //级联选择框发生改变时 ，会触发这个函数
    handleChange() {
      this.getCateParamsObj();
    },
    //点击成为当前标签对应值
    handleTabsClick() {
      console.log(this.activeName);
      //点击切换时 重新获取参数列表
      this.getCateParamsObj();
    },
    //定义获取参数列表方法
    async getCateParamsObj() {
      // console.log(this.selectedCateKeys)
      //如果selectedCateKeys数组length长度为3 则表示为三级数组
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData= []
        this.onlyTableData = []
      }
      //表示已经是三级分类了
      console.log(this.selectedCateKeys);
      //发送请求获取参数列表
      const { data } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (data.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      //在赋值之前对每一个item 进行遍历
      data.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //为每个item设置//默认显示tag标签
        item.inputVisible = false
        //为每个item设置 默认绑定的值
        item.inputValue = ''
      });
      console.log(data.data);

      //如果this.activeName === 'many'则为动态参数 否则为静态参数
      if (this.activeName === "many") {
        this.manyTableData = data.data;
      } else {
        this.onlyTableData = data.data;
      }
    },
    //点击按钮显示添加属性对话框
    isShowAddDialog() {
      this.addDialogVisible = true;
    },
    //重置表单数据
    addDialogVisibleClosed() {
      this.$refs.ruleFormRef.resetFields();
    },
    //点击按钮 添加数据
    addParams() {
      //先进行表单验证
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("验证表单失败");
        }
        //发送添加请求
        const { data } = await this.$http.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.AddForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (data.meta.status !== 201) {
          return this.$message.error("添加数据失败");
        }
        this.$message.success("添加数据成功");
        this.addDialogVisible = false;
        //在级联选择框的前提下 在重新刷新数据
        this.getCateParamsObj();
      });
    },
    //修改添加数据对话框
    async showEditDialog(attr_id) {
      const { data } = await this.$http.get(
        `categories/${this.getCateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      );
      if (data.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.editForm = data.data;
      this.editDialogVisible = true;
    },
    //点击取消时  重置数据
    editDialogVisibleClosed() {
      this.$refs.ruleFormRef.resetFields();
    },
    //点击确定提交修改  ----在这之前 显得在修改框中先获取对应的修改值
    editParams() {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) {
          return this.$mesage.error("获取失败");
        }
        //发起修改数据请求
        const { data } = await this.$http.put(
          `categories/${this.getCateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (data.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功");
        this.editDialogVisible = false;
        this.getCateParamsObj();
      });
    },
    //点击删除对应的属性值
    async removeDialog(attr_id) {
      //弹框提示
      const confirmResult = await this.$confirm(
        "此操作将永久删除该数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //判断是否为confirm
      if (confirmResult !== "confirm") {
        return this.$message.error("已取消删除");
      }
      //发送删除请求 删除参数
      const { data } = await this.$http.delete(
        `categories/${this.getCateId}/attributes/${attr_id}`
      );
      if (data.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.editDialogVisible = false;
      this.getCateParamsObj();
    },
    //在按键按起或者失去焦点时 显示ok 
   async handleInputConfirm(row){
      if(row.inputValue.trim().length === 0){
         row.inputValue = ''
         row.inputVisible = false
      }
      //如果有输入值 将保存到inputValue 数组中
        row.attr_vals.push(row.inputValue.trim())
        //切换到 tag中
         row.inputValue = ''
         row.inputVisible = false
      // 发起请求保存这次操作
        this.saveParamsData(row)

      
    },
   async saveParamsData(row){
      const {data} = await this.$http.put(`categories/${this.getCateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
        if(data.meta.status !== 200){
          return this.$message.error('保存失败')
        }
          this.$message.success('保存修改成功')
    },
    //单击按钮实现input输入框
    showInput(row){
      row.inputVisible = true
      //自动获取焦点
      //nextTick 作用 页面上的元素被重新渲染过后，才会知道回调函数
       this.$nextTick( () => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    //点击x 删除
    tagClosed(row,index){
      row.attr_vals.splice(index,1)
      //删除后在保存到后台
       this.saveParamsData(row)


    }
  },
  computed: {
    //如果级联选择器双向绑定的数组length为3 则表示该button可以点击 否则不可用
    isBtnDisable() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    getCateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    //计算在this.activeName === "many"时 显示动态参数 否则为反
    ShowTittle() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  },
  components: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';

.el-row {
  margin-top: 15px;
}
</style>
