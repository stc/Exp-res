function SimpleReverb(context){
  let node = context.createGain()
  let dry = node._dry = context.createGain()
  let wet = node._wet = context.createGain()
  let output = node.output = context.createGain()
  let convolver = node._convolver = context.createConvolver();
  let filter = node._filter = context.createBiquadFilter()
  
  node.connect(dry)
  node.connect(wet)
  convolver.connect(filter)
  dry.connect(output)
  wet.connect(convolver)
  filter.connect(output)
  Object.defineProperties(node, properties)
  node._time = 3
  node._decay = 2
  node._reverse = false
  node.cutoff.value = 20000
  node.filterType = 'lowpass'
  node._building = false
  node._buildImpulse()
  return node
}

let properties = {
  connect: {
    value: function(){
      this.output.connect.apply(this.output, arguments)
    }
  },

  disconnect: {
    value: function(){
      this.output.disconnect.apply(this.output, arguments)
    }
  },

  wet: {
    get: function(){
      return this._wet.gain
    }
  },

  dry: {
    get: function(){
      return this._dry.gain
    }
  },

  cutoff: {
    get: function(){
      return this._filter.frequency
    }
  },

  filterType: {
    get: function(){
      return this._filter.type
    },
    set: function(value){
      this._filter.type = value
    }
  },

  _buildImpulse: {
    value: function () {
      let self = this
      let rate = self.context.sampleRate
      let length = Math.max(rate * self.time, 1)

      if (self._building){
        buildImpulse.cancel(self._building)
      }

      self._building = buildImpulse(length, self.decay, self.reverse, function(channels){
        let impulse = self.context.createBuffer(2, length, rate)
        impulse.getChannelData(0).set(channels[0])
        impulse.getChannelData(1).set(channels[1])
        self._convolver.buffer = impulse
        self._building = false
      })
    }
  },

  /**
   * Public parameters.
   */

  time: {
    enumerable: true,
    get: function () { return this._time; },
    set: function (value) {
      this._time = value;
      this._buildImpulse();
    }
  },

  decay: {
    enumerable: true,
    get: function () { return this._decay; },
    set: function (value) {
      this._decay = value;
      this._buildImpulse();
    }
  },

  reverse: {
    enumerable: true,
    get: function () { return this._reverse; },
    set: function (value) {
      this._reverse = value;
      this._buildImpulse();
    }
  }
}

let chunkSize = 2048
let queue = []
let targets = {}
let lastImpulseId = 0
function buildImpulse(length, decay, reverse, cb){
  
  lastImpulseId += 1
  let target = targets[lastImpulseId] = {
    id: lastImpulseId,
    cb: cb,
    length: length,
    decay: decay,
    reverse: reverse,
    impulseL: new Float32Array(length),
    impulseR: new Float32Array(length)
  }
  queue.push([ target.id, 0, Math.min(chunkSize, length) ])
  setTimeout(next, 1)
  return lastImpulseId
}

buildImpulse.cancel = function(id){
  if (targets[id]){
    ;delete targets[id]
    return true
  } else {
    return false
  }
}

function next(){
  let item = queue.shift()
  if (item){
    let target = targets[item[0]]
    if (target){
      let length = target.length
      let decay = target.decay
      let reverse = target.reverse
      let from = item[1]
      let to = item[2]
      let impulseL = target.impulseL
      let impulseR = target.impulseR

      for (let i=from;i<to;i++) {
        let n = reverse ? length - i : i;
        impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      }

      if (to >= length-1){
        ;delete targets[item[0]]
        target.cb([target.impulseL, target.impulseR])
      } else {
        queue.push([ target.id, to, Math.min(to + chunkSize, length) ])
      }
    }
  }
  
  if (queue.length){
    setTimeout(next, 5)
  }
}