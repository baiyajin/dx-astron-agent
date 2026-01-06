package com.iflytek.astron.console.toolkit.service.tool;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.iflytek.astron.console.commons.exception.BusinessException;
import com.iflytek.astron.console.commons.response.ResponseEnum;
import com.iflytek.astron.console.toolkit.entity.table.tool.RpaInfo;
import com.iflytek.astron.console.toolkit.entity.tool.CreateRpaInfoReq;
import com.iflytek.astron.console.toolkit.entity.tool.UpdateRpaInfoReq;
import com.iflytek.astron.console.toolkit.mapper.tool.RpaInfoMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class RpaInfoService extends ServiceImpl<RpaInfoMapper, RpaInfo> {

    /**
     * Get all available RPA platforms (not deleted).
     *
     * @return list of RPA platforms
     */
    public List<RpaInfo> list() {
        return this.list(new LambdaQueryWrapper<RpaInfo>()
                .eq(RpaInfo::getIsDeleted, 0)
                .orderByDesc(RpaInfo::getCreateTime));
    }

    /**
     * Create a new RPA platform.
     *
     * @param req creation request
     * @return created platform info
     * @throws BusinessException if platform name already exists
     */
    @Transactional
    public RpaInfo create(CreateRpaInfoReq req) {
        // Check if platform name already exists
        long exists = this.count(new LambdaQueryWrapper<RpaInfo>()
                .eq(RpaInfo::getName, req.name())
                .eq(RpaInfo::getIsDeleted, 0));
        if (exists > 0) {
            throw new BusinessException(ResponseEnum.RESPONSE_FAILED, 
                    "Platform name already exists: " + req.name());
        }

        RpaInfo rpaInfo = new RpaInfo();
        rpaInfo.setName(req.name());
        rpaInfo.setCategory(req.category());
        rpaInfo.setValue(req.value());
        rpaInfo.setIcon(req.icon());
        rpaInfo.setPath(req.path());
        rpaInfo.setRemarks(req.remarks());
        rpaInfo.setIsDeleted(0);
        rpaInfo.setCreateTime(LocalDateTime.now());
        rpaInfo.setUpdateTime(LocalDateTime.now());

        this.save(rpaInfo);
        return rpaInfo;
    }

    /**
     * Update an existing RPA platform.
     *
     * @param id  platform ID
     * @param req update request
     * @return updated platform info
     * @throws BusinessException if platform does not exist or name duplication occurs
     */
    @Transactional
    public RpaInfo update(Long id, UpdateRpaInfoReq req) {
        RpaInfo rpaInfo = this.getById(id);
        if (rpaInfo == null || rpaInfo.getIsDeleted() == 1) {
            throw new BusinessException(ResponseEnum.RESPONSE_FAILED, 
                    "Platform does not exist, id=" + id);
        }

        // Check name duplication if name is being changed
        if (req.name() != null && !req.name().isBlank() 
                && !req.name().equals(rpaInfo.getName())) {
            long exists = this.count(new LambdaQueryWrapper<RpaInfo>()
                    .eq(RpaInfo::getName, req.name())
                    .eq(RpaInfo::getIsDeleted, 0)
                    .ne(RpaInfo::getId, id));
            if (exists > 0) {
                throw new BusinessException(ResponseEnum.RESPONSE_FAILED, 
                        "Platform name already exists: " + req.name());
            }
            rpaInfo.setName(req.name());
        }

        if (req.category() != null) {
            rpaInfo.setCategory(req.category());
        }
        if (req.value() != null) {
            rpaInfo.setValue(req.value());
        }
        if (req.icon() != null) {
            rpaInfo.setIcon(req.icon());
        }
        if (req.path() != null) {
            rpaInfo.setPath(req.path());
        }
        if (req.remarks() != null) {
            rpaInfo.setRemarks(req.remarks());
        }

        rpaInfo.setUpdateTime(LocalDateTime.now());
        this.updateById(rpaInfo);
        return rpaInfo;
    }

    /**
     * Delete (soft delete) an RPA platform.
     *
     * @param id platform ID
     * @throws BusinessException if platform does not exist
     */
    @Transactional
    public void delete(Long id) {
        RpaInfo rpaInfo = this.getById(id);
        if (rpaInfo == null || rpaInfo.getIsDeleted() == 1) {
            throw new BusinessException(ResponseEnum.RESPONSE_FAILED, 
                    "Platform does not exist, id=" + id);
        }

        rpaInfo.setIsDeleted(1);
        rpaInfo.setUpdateTime(LocalDateTime.now());
        this.updateById(rpaInfo);
    }
}
