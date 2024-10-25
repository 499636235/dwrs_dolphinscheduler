/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineComponent, PropType, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NInput,
  NButton,
  NIcon,
  NTransfer,
  NSpace,
  NRadioGroup,
  NRadioButton,
  NTreeSelect,
  NDataTable,
  NPagination
} from 'naive-ui'
import { useAuthorize } from './use-authorize'
import Modal from '@/components/modal'
import styles from '../index.module.scss'
import type { TAuthType } from '../types'
import { useColumns } from './use-columns'
import { SearchOutlined } from '@vicons/antd'

const props = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  row: {
    type: Object as PropType<any>,
    default: {}
  },
  // tenantId: {
  //   type: Number,
  //   default: 0
  // },
  type: {
    type: String as PropType<TAuthType>,
    default: 'auth_project'
  }
}
export const AuthorizeModal = defineComponent({
  name: 'authorize-project-modal',
  props,
  emits: ['cancel'],
  setup(props, ctx) {
    const { t } = useI18n()
    const {
      state,
      onInit,
      onSave,
      getProjects,
      revokeProjectByIdRequest,
      grantProjectWithReadPermRequest,
      requestData,
      handleChangePageSize
    } = useAuthorize()

    let tenantId = 0

    const onCancel = () => {
      ctx.emit('cancel')
    }
    const onConfirm = async () => {
      const result = await onSave(props.type, tenantId)
      if (result) onCancel()
    }

    const onRevokeProject = () => {
      revokeProjectByIdRequest(tenantId, state.projectIds)
    }
    const onGrantReadPerm = () => {
      grantProjectWithReadPermRequest(tenantId, state.projectIds)
    }

    const { columnsRef } = useColumns()
    const handleCheck = (rowKeys: Array<number>) => {
      state.projectIds = rowKeys.join()
    }
    watch(
      () => props.show,
      () => {
        if (props.show) {
          tenantId = props.row.row.id
          onInit(props.type, tenantId)
        }
      }
    )

    return {
      t,
      columnsRef,
      rowKey: (row: any) => row.id,
      ...toRefs(state),
      onCancel,
      onConfirm,
      getProjects,
      handleCheck,
      requestData,
      handleChangePageSize,
      onRevokeProject,
      onGrantReadPerm
    }
  },
  render(props: { type: TAuthType; tenantId: number }) {
    const { t } = this
    const { type, tenantId } = props
    return (
      <Modal
        show={this.show}
        title={t(`security.user.${type}`)}
        onCancel={this.onCancel}
        confirmLoading={this.loading}
        onConfirm={this.onConfirm}
        confirmClassName='btn-submit'
        cancelClassName='btn-cancel'
      >
        {type === 'authorize_project' && (
          <NSpace vertical>
            <NSpace>
              <NButton
                size='small'
                type='primary'
                onClick={this.onRevokeProject}
              >
                {t('security.user.revoke_auth')}
              </NButton>
              <NButton
                size='small'
                type='primary'
                onClick={this.onGrantReadPerm}
              >
                {t('security.user.grant_read')}
              </NButton>
              <NInput
                size='small'
                placeholder={t('project.list.project_tips')}
                clearable
                v-model:value={this.searchVal}
              />
              {/* <NButton size='small' type='primary' onClick={this.handleSearch}> */}
              <NButton
                size='small'
                type='primary'
                onClick={() => this.getProjects(tenantId)}
              >
                <NIcon>
                  <SearchOutlined />
                </NIcon>
              </NButton>
            </NSpace>
            <NDataTable
              virtualScroll
              row-class-name='items'
              columns={this.columnsRef.columns}
              data={this.projectWithAuthorizedLevel}
              loading={this.loading}
              max-height='250'
              row-key={this.rowKey}
              on-update:checked-row-keys={this.handleCheck}
            />
            <div class={styles.pagination}>
              <NPagination
                v-model:page={this.pagination.page}
                v-model:page-size={this.pagination.pageSize}
                page-count={this.pagination.totalPage}
                show-size-picker
                page-sizes={[5, 10, 50]}
                show-quick-jumper
                onUpdatePage={this.requestData}
                onUpdatePageSize={this.handleChangePageSize}
              />
            </div>
          </NSpace>
        )}
      </Modal>
    )
  }
})

export default AuthorizeModal
