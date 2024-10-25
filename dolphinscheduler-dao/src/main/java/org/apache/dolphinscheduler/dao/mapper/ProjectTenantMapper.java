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

package org.apache.dolphinscheduler.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.dolphinscheduler.dao.entity.ProjectTenant;
import org.apache.ibatis.annotations.Param;

/**
 * project tenant mapper interface
 */
public interface ProjectTenantMapper extends BaseMapper<ProjectTenant> {

    /**
     * delete project tenant relation
     *
     * @param projectId projectId
     * @param tenantId tenantId
     * @return delete result
     */
    int deleteProjectRelation(@Param("projectId") int projectId,
                              @Param("tenantId") int tenantId);

    /**
     * query project relation
     *
     * @param projectId projectId
     * @param tenantId tenantId
     * @return project tenant relation
     */
    ProjectTenant queryProjectRelation(@Param("projectId") int projectId,
                                     @Param("tenantId") int tenantId);
}
