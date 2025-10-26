<?php

namespace App\Notifications;

use App\Models\Hazard;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Str;


class HazardReported extends Notification
{
    use Queueable;

    protected $hazard;

    public function __construct(Hazard $hazard)
    {
        $this->hazard = $hazard;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $h = $this->hazard;
        $title = $h->title ?: $h->type->name;
        $url = config('app.url') . "/hazards/{$h->id}";

        return (new MailMessage)
            ->subject("New hazard reported: {$title}")
            ->line("A new hazard was reported: {$h->type->name} — severity {$h->severity}.")
            ->line($h->description ? Str::limit($h->description, 200) : '')
            ->action('View Hazard', $url);
    }

    public function toArray($notifiable)
    {
        return [
            'hazard_id' => $this->hazard->id,
            'type' => $this->hazard->type->name ?? null,
            'severity' => $this->hazard->severity,
            'latitude' => $this->hazard->latitude,
            'longitude' => $this->hazard->longitude,
        ];
    }
}
