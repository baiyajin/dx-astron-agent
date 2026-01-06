package com.iflytek.astron.console.toolkit.entity.tool;

/**
 * Request object for updating an existing RPA platform.
 * <p>
 * This record carries the update information such as the platform name,
 * category, value, icon, path, and remarks.
 * </p>
 *
 * @param name     New name of the platform (optional)
 * @param category Configuration category (optional)
 * @param value    JSON string containing field definitions (optional)
 * @param icon     Icon URL of the platform (optional)
 * @param path     Official website address (optional)
 * @param remarks  Optional remarks or description (optional)
 */
public record UpdateRpaInfoReq(
        String name,
        String category,
        String value,
        String icon,
        String path,
        String remarks
) {}
