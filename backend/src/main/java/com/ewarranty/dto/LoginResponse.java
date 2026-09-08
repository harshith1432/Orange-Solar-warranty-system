package com.ewarranty.dto;

import com.ewarranty.entity.User;

public class LoginResponse {
    private boolean success;
    private String message;
    private String token;
    private User user;

    public LoginResponse(boolean success, String message, String token, User user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getToken() { return token; }
    public User getUser() { return user; }
}
