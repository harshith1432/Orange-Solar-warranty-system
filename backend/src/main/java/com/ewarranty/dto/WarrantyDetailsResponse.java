package com.ewarranty.dto;

import com.ewarranty.entity.NotificationLog;
import com.ewarranty.entity.TimelineEvent;
import com.ewarranty.entity.WarrantyCard;
import com.ewarranty.entity.WarrantyRequest;

import java.util.List;

public class WarrantyDetailsResponse {
    private WarrantyRequest request;
    private WarrantyCard card;
    private List<TimelineEvent> timeline;
    private List<NotificationLog> notifications;

    public WarrantyDetailsResponse(WarrantyRequest request, WarrantyCard card, List<TimelineEvent> timeline, List<NotificationLog> notifications) {
        this.request = request;
        this.card = card;
        this.timeline = timeline;
        this.notifications = notifications;
    }

    public WarrantyRequest getRequest() { return request; }
    public WarrantyCard getCard() { return card; }
    public List<TimelineEvent> getTimeline() { return timeline; }
    public List<NotificationLog> getNotifications() { return notifications; }
}
