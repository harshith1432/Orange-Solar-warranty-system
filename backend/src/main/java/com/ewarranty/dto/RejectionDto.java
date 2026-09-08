package com.ewarranty.dto;

public class RejectionDto {
    private String reason;
    private boolean sendWhatsapp = true;
    private boolean sendEmail = true;
    private boolean sendSms = true;

    public RejectionDto() {}

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public boolean isSendWhatsapp() { return sendWhatsapp; }
    public void setSendWhatsapp(boolean sendWhatsapp) { this.sendWhatsapp = sendWhatsapp; }

    public boolean isSendEmail() { return sendEmail; }
    public void setSendEmail(boolean sendEmail) { this.sendEmail = sendEmail; }

    public boolean isSendSms() { return sendSms; }
    public void setSendSms(boolean sendSms) { this.sendSms = sendSms; }
}
