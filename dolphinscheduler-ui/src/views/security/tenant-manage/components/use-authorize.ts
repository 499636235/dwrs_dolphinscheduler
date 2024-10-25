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
import { reactive } from 'vue'
import {
  queryProjectWithTenantAuthorizedListPaging
} from '@/service/modules/projects'
import {
  grantProjectWithReadPerm,
  revokeProjectById
} from '@/service/modules/tenants'
import type { TAuthType, IResourceOption, IOption, IRecord } from '../types'

export function useAuthorize() {
  const state = reactive({
    saving: false,
    loading: false,
    projectIds: '',
    currentRecord: {} as IRecord | null,
    projectWithAuthorizedLevel: [],
    authorizedProjects: [] as number[],
    unauthorizedProjects: [] as IOption[],
    authorizedDatasources: [] as number[],
    unauthorizedDatasources: [] as IOption[],
    authorizedUdfs: [] as number[],
    unauthorizedUdfs: [] as IOption[],
    authorizedNamespaces: [] as number[],
    unauthorizedNamespaces: [] as IOption[],
    resourceType: 'file',
    fileResources: [] as IResourceOption[],
    udfResources: [] as IResourceOption[],
    authorizedFileResources: [] as number[],
    authorizedUdfResources: [] as number[],
    pagination: {
      pageSize: 50,
      page: 1,
      totalPage: 0
    },
    searchVal: '',
    tenantId: 0
  })

  const getProjects = async (tenantId: number) => {
    if (state.loading) return
    state.loading = true
    if (tenantId) {
      state.tenantId = tenantId
    }

    const projectsList = await queryProjectWithTenantAuthorizedListPaging({
      tenantId,
      searchVal: state.searchVal,
      pageSize: state.pagination.pageSize,
      pageNo: state.pagination.page
    })
    state.loading = false
    if (!projectsList) throw Error()
    state.pagination.totalPage = projectsList.totalPage
    state.projectWithAuthorizedLevel = projectsList.totalList
    return state.projectWithAuthorizedLevel
  }

  const requestData = async (page: number) => {
    state.pagination.page = page
    await getProjects(state.tenantId)
  }

  const handleChangePageSize = async (pageSize: number) => {
    state.pagination.page = 1
    state.pagination.pageSize = pageSize
    await getProjects(state.tenantId)
  }

  const revokeProjectByIdRequest = async (
    tenantId: number,
    projectIds: string
  ) => {
    await revokeProjectById({
      id: tenantId,
      projectIds: projectIds
    })
    await getProjects(tenantId)
  }

  const grantProjectWithReadPermRequest = async (
    tenantId: number,
    projectIds: string
  ) => {
    await grantProjectWithReadPerm({
      id: tenantId,
      projectIds: projectIds
    })
    await getProjects(tenantId)
  }

  const onInit = (type: TAuthType, tenantId: number) => {
    if (type === 'authorize_project') {
      getProjects(tenantId)
    }
  }

  /*
    getParent
  */
  const getParent = (data2: Array<number>, nodeId2: number) => {
    let arrRes: Array<any> = []
    if (data2.length === 0) {
      if (nodeId2) {
        arrRes.unshift(data2)
      }
      return arrRes
    }
    const rev = (data: Array<any>, nodeId: number) => {
      for (let i = 0, length = data.length; i < length; i++) {
        const node = data[i]
        if (node.id === nodeId) {
          arrRes.unshift(node)
          rev(data2, node.pid)
          break
        } else {
          if (node.children) {
            rev(node.children, nodeId)
          }
        }
      }
      return arrRes
    }
    arrRes = rev(data2, nodeId2)
    return arrRes
  }

  const onSave = async (type: TAuthType, tenantId: number) => {
    if (state.saving) return false
    state.saving = true
    if (type === 'authorize_resource') {}
    state.saving = false
    return true
  }

  return {
    state,
    onInit,
    onSave,
    getProjects,
    revokeProjectByIdRequest,
    grantProjectWithReadPermRequest,
    requestData,
    handleChangePageSize
  }
}
