<?php

namespace App\Notifications;

use App\Models\Hazard;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewHazardAlert extends Notification
{
    protected $hazard;

    public function __construct(Hazard $hazard)
    {
        $this->hazard = $hazard;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $h = $this->hazard;
        $title = $h->title ?: $h->hazardType->name;

        return (new MailMessage)
            ->subject("🚨 New hazard reported: {$title}")
            ->line("A new {$h->hazardType->name} has been reported.")
            ->line("Severity level: {$h->severity}")
            ->line("Location: {$h->latitude}, {$h->longitude}")
            ->action('View Hazard', url("/hazards/{$h->id}"))
            ->line('Stay safe.');
    }
}
