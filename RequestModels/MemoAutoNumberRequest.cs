﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class MemoAutoNumberRequest:BaseBodyRequestModel
    {
        public RunningRequestModel MemoAutoNumber { get; set; }
    }
}
