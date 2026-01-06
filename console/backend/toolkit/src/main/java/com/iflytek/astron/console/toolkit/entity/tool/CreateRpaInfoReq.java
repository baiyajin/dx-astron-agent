package com.iflytek.astron.console.toolkit.entity.tool;

/**
 * Request object for creating an RPA platform.
 * <p>
 * This record holds the information required when creating an RPA platform,
 * including name, category, value (field definitions), icon, path, and remarks.
 * </p>
 *
 * @param name     Display name of the platform (e.g., "动悉RPA")
 * @param category Configuration category
 * @param value    JSON string containing field definitions (e.g., API key fields)
 * @param icon     Icon URL of the platform
 * @param path     Official website address
 * @param remarks  Optional remarks or description
 */
public record CreateRpaInfoReq(
        String name,
        String category,
        String value,
        String icon,
        String path,
        String remarks
) {}
