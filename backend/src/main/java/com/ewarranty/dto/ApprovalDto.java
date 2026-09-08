package com.ewarranty.dto;

public class ApprovalDto {
    private String warrantyPeriod = "1 Year";
    private Integer customMonths;
    private boolean sendWhatsapp = true;
    private boolean sendEmail = true;
    private boolean sendSms = true;
    private String adminNotes;

    public ApprovalDto() {}

    public String getWarrantyPeriod() { return warrantyPeriod; }
    public void setWarrantyPeriod(String warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; }

    public Integer getCustomMonths() { return customMonths; }
    public void setCustomMonths(Integer customMonths) { this.customMonths = customMonths; }

    public boolean isSendWhatsapp() { return sendWhatsapp; }
    public void setSendWhatsapp(boolean sendWhatsapp) { this.sendWhatsapp = sendWhatsapp; }

    public boolean isSendEmail() { return sendEmail; }
    public void setSendEmail(boolean sendEmail) { this.sendEmail = sendEmail; }

    public boolean isSendSms() { return sendSms; }
    public void setSendSms(boolean sendSms) { this.sendSms = sendSms; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}
