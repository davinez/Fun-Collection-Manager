﻿using System;

namespace Manager.Application.Common.Dtos;

public class BookmarkDetailDto
{
    public required CollectionDetailDto CollectionDetail { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}